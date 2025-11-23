export class User {
  private email: string;
  private nickname: string;

  constructor(email: string, nickname: string) {
    this.email = email;
    this.nickname = nickname;
  }

  // Setters and Getters
  setEmail(email: string) {
    this.email = email;
  }
  setNickname(nickname: string) {
    this.nickname = nickname;
  }
  
  getEmail(): string {
    return this.email;
  }
  getNickname(): string {
    return this.nickname;
  }


  updateProfile(nickname?: string, email?: string): User {
    //? --> pueden no ponerse
    if (nickname) {
      this.nickname = nickname;
    }
    if (email) {
      this.email = email;
    }
    return this;
  }

  equalsUser(other: User | null): boolean {
    if (!other) return false;
    try {
      const a = this.getEmail()?.trim().toLowerCase() ?? "";
      const b = other.getEmail()?.trim().toLowerCase() ?? "";
      return a !== "" && a === b;
    } catch {
      return false;
    }
  }
}
