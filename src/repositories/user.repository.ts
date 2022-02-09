import db from "../db";
import DatabaseError from "../models/errors/database.error.models";
import User from "../models/user.model";

require('dotenv').config();

class UserRepository {

    async findAllUsers(): Promise<User[]> {
        const query = `
            SELECT uuid,username
            FROM application_user
        `;

        const { rows } = await db.query<User>(query);

        return rows || [];
    }

    async findById(uuid: String): Promise<User> {
        try {
            const query = `
            SELECT uuid,username
            FROM application_user
            WHERE uuid = $1
            `;

            const values = [uuid];

            const { rows } = await db.query<User>(query, values);
            const [user] = rows;

            return user;
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID.', error);
        }
    }

    async create(user: User): Promise<String> {
        const script = `
        INSERT INTO application_user (
            username,password
        ) VALUES ($1, crypt($2, ${process.env.HASH}))
        RETURNING uuid
        `;

        const { username, password } = user;

        const values = [username, password];

        const { rows } = await db.query<{ uuid: String }>(script, values);
        const [newUser] = rows;

        return newUser.uuid;

    }

    async update(user: User): Promise<void> {
        const script = `
        UPDATE application_user
        SET
            username = $1,
            password = crypt($2, 'my_salt')
        WHERE uuid = $3
        `;

        const { username, password, uuid } = user;

        const values = [username, password, uuid];

        await db.query(script, values);

    }

    async remove(uuid: String): Promise<void> {
        const script = `
        DELETE FROM application_user
        WHERE uuid = $1
        `;

        const values = [uuid];

        await db.query(script, values);

    }

}

export default new UserRepository();
