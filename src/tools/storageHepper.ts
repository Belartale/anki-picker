export class StorageHepper {
        static set({ key, value, callback }: { key: string; value: string; callback?: (value: string) => void }) {
            if (!key || !value) {
                throw new Error("Key or value not found");
            }

            chrome.storage.sync.set({ [key]: value }, callback as (() => void)); // todo remove "as"
        }

        static get({ key, callback }: { key: string; callback: (value: string) => void }) {
            if (!key) {
                throw new Error("Key not found");
            } else if (!callback) {
                throw new Error("Callback not found");
            }

            chrome.storage.sync.get([key], function (storage) {
                if (storage[key]) {
                    callback(storage[key]);
                } else {
                    throw new Error('Value from "chrome.storage" not found');
                }
            });
        }
    }