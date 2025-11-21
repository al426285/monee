export interface UserRepository {
  deleteUser(userId: string): Promise<void> ;
  
}