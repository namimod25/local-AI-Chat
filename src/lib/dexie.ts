import Dexie, { Table } from 'dexie';


//table declarations
interface DEX_Thread {
    id: string; //uuid
    title: string;
    created_at: Date;
    updated_at: Date;
}

class ChatDB extends Dexie {
    async createThread(title: string) {
     await this.addThread(title);
    }
    threads!: Table<DEX_Thread>;


    constructor() {
        super('AiDb')
        this.version(1).stores({
            threads: 'id, title, created_at, updated_at'
        })

        this.threads.hook("creating", (_, Object) =>{
            Object.created_at = new Date();
            Object.updated_at = new Date();
        });
    }
/////// end >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> inisialize DB <<<<<<<<

    async addThread(title: string) {   //storeIn Create thread
        const id = crypto.randomUUID();

        await this.threads.add({
            id,
            title,
            created_at: new Date(),
            updated_at: new Date()
        });

        return id;
    }

    async getThreads() {
        return this.threads.reverse().sortBy('updated_at');
    }
}

export const db = new ChatDB();