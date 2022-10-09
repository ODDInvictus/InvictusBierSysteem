import { Client, Databases, Account, Storage, Avatars } from 'appwrite'

declare global {
  interface Window {
    api: Client
    db: Databases
    account: Account
    storage: Storage
    avatars: Avatars
  }

  interface ImportMetaEnv {
    VITE_APPWRITE_PROJECT_ID: string
    VITE_APPWRITE_API_ENDPOINT: string
    VITE_APPWRITE_COLLECTION_ID: string

    VITE_APPWRITE_USER_ICON_BUCKET_ID: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}