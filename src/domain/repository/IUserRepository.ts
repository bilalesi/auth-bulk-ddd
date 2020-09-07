import UserEmail from "../duser/bo-user/UserEmail";
import UserPhone from "../duser/bo-user/UserPhone";
import UserID from "../duser/bo-user/UserId";
import UserName from "../duser/bo-user/UserName";
import User from "../duser/duser";

interface IUserRepository{
    existsWithEmail(userEmail: UserEmail): Promise<boolean>;
    existsWithPhone(userPhone: UserPhone): Promise<boolean>;
    existsWithId(userId: UserID): Promise<boolean>;
    existsWithUsername(username: UserName): Promise<boolean>;
    getUserById(userId: UserID | string): Promise<User>;
    getUserByUsername(username: UserName | string): Promise<User>;
    save(user: User): Promise<void>;
}


export default IUserRepository