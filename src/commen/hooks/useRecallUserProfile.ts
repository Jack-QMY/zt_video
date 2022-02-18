import { useEffect } from 'react';
import { fetchRequest } from '~/commen';
import { RecordKeys, Storage, userStore } from '~/store';

export const useRecallUserProfile = () => {
    useEffect(() => {
        fetchRequest({
            url: 'wanlshop/user/refresh',
            method: 'POST',
        })
            .then((res) => {
                userStore.changeProfile(res?.data.userinfo);
            })
            .catch((err) => {});
    }, []);

    useEffect(() => {
        (async function getMeFormStorage() {
            const profile = await Storage.getItem(RecordKeys.me);
            userStore.recallUser(profile);
        })();
    }, []);
};
