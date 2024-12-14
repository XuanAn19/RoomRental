import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Subject quản lý danh sách bài đăng
  private postsSubject = new BehaviorSubject<any[]>([]);
  public posts$ = this.postsSubject.asObservable();
  constructor(private apiService: ApiService) {}

  private allUsersSubject = new BehaviorSubject<any[]>([]);
  private friendRequestsSubject = new BehaviorSubject<any[]>([]);
  public friendRequests$ = this.friendRequestsSubject.asObservable();
  private searchResultsSubject = new BehaviorSubject<any[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();
  // Subject quản lý danh sách bạn bè
  public friendsSubject = new BehaviorSubject<any[]>([]);
  public friends$ = this.friendsSubject.asObservable();

  //update số lượng bài viết khi đăng status
  private postCountUpdatedSubject = new BehaviorSubject<null>(null);
  postCountUpdated$ = this.postCountUpdatedSubject.asObservable();

  // Gọi khi số lượng bài viết được cập nhật
  notifyPostCountUpdated(): void {
    this.postCountUpdatedSubject.next(null);
  }

  //update số lượng bạn bè khi hủy kết bản
  private friendsCountUpdatedSubject = new BehaviorSubject<null>(null);
  public friendsCountUpdated$ = this.friendsCountUpdatedSubject.asObservable();

  // Gọi khi số lượng bạn bè được cập nhật
  notifyFriendsCountUpdated(): void {
    this.friendsCountUpdatedSubject.next(null);
  }

  // Lấy danh sách lời mời kết bạn từ API
  getFriendRequests(): void {
    console.log('getFriendRequests called');
    const userId = sessionStorage.getItem('auth-idUser'); // Lấy userId từ sessionStorage
    console.log('Current auth-idUser in sessionStorage:', userId);

    if (!userId) {
      console.log('User ID not found in sessionStorage.');
      return;
    }

    const url = `Friends/request_list/${userId}`;
    this.apiService.API_Basic_GetTypeRequest1(url).subscribe(
      (data: any[]) => {
        console.log('Raw API data:', data);
        // Định dạng dữ liệu
        const formattedData = data.map((item) => ({
          id_friend_request: item.id_friend_request,
          sender_information: {
            full_name: item.sender_information?.full_name || 'Không rõ',
            image: item.sender_information?.image || null,
          },
          created_at: this.formatDate(item.created_at),
        }));
        this.friendRequestsSubject.next(formattedData);
      },
      (error) => {
        console.log('Error fetching friend requests:', error);
      }
    );
  }

  // Hàm định dạng ngày tháng
  private formatDate(dateString: string): string {
    // Tách chuỗi ngày giờ
    const [datePart, timePart] = dateString.split(' '); // "13/12/2024" và "20:43:12"
    const [day, month, year] = datePart.split('/').map(Number); // Tách ngày, tháng, năm
    const [hours, minutes, seconds] = timePart.split(':').map(Number); // Tách giờ, phút, giây

    // Tạo đối tượng Date
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Ngày không hợp lệ'; // Xử lý nếu thời gian không hợp lệ
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} s`;
    }
    if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} m`;
    }
    if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} h`;
    }
    if (diffInSeconds < 7 * 86400) {
      return `${Math.floor(diffInSeconds / 86400)} d`;
    }

    // Format kiểu dd/MM/yyyy nếu hơn 7 ngày
    return `${day.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}/${year}`;
  }

  addFriendRequest(userId: number): Observable<any> {
    const url = 'Friends'; // Endpoint API
    const currentUserId = sessionStorage.getItem('auth-idUser'); // ID người gửi

    if (!currentUserId) {
      console.error('Current user ID not found in sessionStorage.');
      return of({ status: 'Error', message: 'Current user not logged in.' });
    }

    const payload = {
      id_user_send: currentUserId, // ID người gửi
      id_user_accept: userId, // ID người nhận
    };

    return this.apiService.API_Basic_PostTypeRequest(url, payload).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          console.log('Friend request sent successfully.');
          return response;
        } else {
          throw new Error('Failed to send friend request.');
        }
      }),
      catchError((error: any) => {
        console.error('Error sending friend request:', error);
        return of({
          status: 'Error',
          message: 'Failed to send friend request.',
        });
      })
    );
  }

  // Hàm lấy danh sách bạn bè từ API
  getFriendsList(userId: string): Observable<any[]> {
    const url = `Friends/list/${userId}`;
    return new Observable((observer) => {
      this.apiService.API_Basic_GetTypeRequest1(url).subscribe(
        (response: any) => {
          if (response.status === 'Success') {
            const friends = response.data.map((friend: any) => ({
              id: friend.id,
              name: friend.friend_information.full_name || 'Không có tên',
              avatar:
                friend.friend_information.image ||
                'https://via.placeholder.com/150',
            }));
            observer.next(friends); // Trả dữ liệu
            observer.complete();
          } else {
            console.warn(response.message);
            observer.next([]); // Trả về mảng rỗng nếu không có bạn bè
            observer.complete();
          }
        },
        (error) => {
          console.error('Error fetching friends:', error);
          observer.error(error); // Truyền lỗi
        }
      );
    });
  }

  // Thêm hàm lấy số lượng bạn bè
  getFriendsCount(userId: string): Observable<number> {
    const url = `Friends/User/${userId}/quanity`;
    return this.apiService.API_Basic_GetTypeRequest1(url).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          return response.data; // Trả về số lượng bạn bè
        } else {
          return 0; // Nếu không có bạn bè, trả về 0
        }
      })
    );
  }

  // Chấp nhận lời mời kết bạn
  acceptFriendRequest(requestId: number): Observable<any> {
    const url = `Friends/${requestId}`;
    return this.apiService.API_Basic_PutTypeRequest(url, {}).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          const updatedRequests = this.friendRequestsSubject
            .getValue()
            .filter((request) => request.id_friend_request !== requestId);
          this.friendRequestsSubject.next(updatedRequests);
          // Thông báo số lượng bạn bè đã thay đổi
          this.notifyFriendsCountUpdated();
          return response;
        } else {
          throw new Error('Failed to accept friend request');
        }
      })
    );
  }

  // Hàm xóa lời mời kết bạn
  deleteFriendRequest(id: number): Observable<any> {
    const url = `Friends/${id}`; // Đường dẫn API xóa lời mời
    return this.apiService.API_Basic_DeleteTypeRequest(url).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          // Xóa lời mời trong BehaviorSubject
          const updatedRequests = this.friendRequestsSubject
            .getValue()
            .filter((request) => request.id_friend_request !== id);
          this.friendRequestsSubject.next(updatedRequests);
          return response;
        } else {
          throw new Error('Failed to delete friend request.');
        }
      })
    );
  }

  // Hàm hủy kết bạn
  unfriend(friendId: number): Observable<any> {
    const url = `Friends/${friendId}`; // ID của bảng Friend
    return this.apiService.API_Basic_DeleteTypeRequest(url).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          const updatedFriends = this.friendsSubject
            .getValue()
            .filter((friend) => friend.id !== friendId); // Đúng ID
          this.friendsSubject.next(updatedFriends);
          this.notifyFriendsCountUpdated();
          return response;
        } else {
          throw new Error('Failed to unfriend.');
        }
      }),
      catchError((error: any) => {
        //  console.error('Error unfriending:', error);
        return of({ status: 'Error', message: 'Failed to unfriend.' });
      })
    );
  }

  // Hàm tìm kiếm người dùng
  searchUsers(key: string): Observable<any[]> {
    const sanitizedKey = key.replace(/['"]/g, ''); // Loại bỏ dấu ' hoặc "
    const url = `Home/Search/${sanitizedKey}`;
    console.log('API URL:', url); // Kiểm tra URL
    return this.apiService.API_Basic_GetTypeRequest1(url).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          // Đảm bảo dữ liệu từ backend khớp với giao diện
          return response.data.map((user: any) => ({
            id: user.id,
            full_name: user.full_name,
            image: user.image || 'https://via.placeholder.com/150',
          }));
        } else {
          //  console.warn(response.message);
          return [];
        }
      })
    );
  }

  updateSearchResults(key: string): void {
    this.searchUsers(key).subscribe(
      (results) => {
        this.searchResultsSubject.next(results);
      },
      (error) => {
        console.log('Error updating search results:', error);
        this.searchResultsSubject.next([]);
      }
    );
  }

  /******************BÀI ĐĂNG STATUS************* */

  // Hàm để đăng trạng thái mới (mock)
  postStatus(content: string): Observable<any> {
    const userId = sessionStorage.getItem('auth-idUser'); // Lấy userId từ sessionStorage
    if (!userId) {
      return of({ status: 'Error', message: 'User ID not found.' });
    }

    const requestPayload = {
      id_user: userId,
      content: content,
    };

    // Giả lập yêu cầu API gửi dữ liệu tới backend
    const url = 'Status';

    return this.apiService.API_Basic_PostTypeRequest(url, requestPayload).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          return response.data; // Trả về dữ liệu khi thành công
        } else {
          return [];
        }
      })
    );
  }
  // Hàm để lấy danh sách bài đăng
  getPosts(): Observable<any> {
    const userId = sessionStorage.getItem('auth-idUser');
    if (!userId) {
      console.log('User ID not found in sessionStorage.');
    }

    const url = `Status/User/${userId}`;
    return this.apiService.API_Basic_GetTypeRequest1(url).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          return response.data.map((post: any) => ({
            ...post,
            creat_at: this.parseDate(post.creat_at),
            updated_at: this.parseDate(post.updated_at),
          }));
        } else {
          return [];
        }
      })
    );
  }

  deleteStatus(statusId: number): Observable<any> {
    const url = `Status/${statusId}`;
    return this.apiService.API_Basic_DeleteTypeRequest(url).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          console.log('Status deleted successfully.');
          return response;
        } else {
          throw new Error(response.message || 'Failed to delete status.');
        }
      }),
      catchError((error: any) => {
        console.error('Error deleting status:', error);
        return of({ status: 'Error', message: 'Failed to delete status.' });
      })
    );
  }

  // Hàm để chuyển đổi chuỗi ngày sang đối tượng Date
  private parseDate(dateString: string): Date | null {
    const [day, month, yearAndTime] = dateString.split('/');
    const [year, time] = yearAndTime.split(' ');
    const [hours, minutes, seconds] = time.split(':');
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds)
    );
  }

  // Hàm để lấy số lượng bài đăng
  getPostsCount(userId: string): Observable<number> {
    const url = `Status/User/${userId}/quanity`;
    return this.apiService.API_Basic_GetTypeRequest1(url).pipe(
      map((response: any) => {
        if (response.status === 'Success') {
          return response.data;
        } else {
          return 0;
        }
      })
    );
  }
}
