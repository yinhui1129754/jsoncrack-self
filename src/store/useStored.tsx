import create from "zustand";
import { persist } from "zustand/middleware";

type Sponsor = {
    handle: string;
    avatar: string;
    profile: string;
};

function getTomorrow() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return new Date(tomorrow).getTime();
}

export interface Config {
    lightmode: boolean;
    hideCollapse: boolean;
    hideChildrenCount: boolean;
    nodeMaxLength: number;
    showListMode: boolean
    sponsors: {
        users: Sponsor[];
        nextDate: number;
    };
    setSponsors: (sponsors: Sponsor[]) => void;
    setLightTheme: (theme: boolean) => void;
    toggleHideCollapse: (value: boolean) => void;
    toggleShowListMode: (value: boolean) => void;
    toggleHideChildrenCount: (value: boolean) => void;
    setNodeMaxLength: (value: number) => void;
}

const useStored = create(
    persist<Config>(
        set => ({
            lightmode: false,
            showListMode: false,
            hideCollapse: false,
            hideChildrenCount: true,
            nodeMaxLength: 40,
            sponsors: {
                users: [],
                nextDate: Date.now(),
            },
            setLightTheme: (value: boolean) =>
                set({
                    lightmode: value,
                }),
            setSponsors: users =>
                set({
                    sponsors: {
                        users,
                        nextDate: getTomorrow(),
                    },
                }),

            toggleShowListMode: (value: boolean) => set({ showListMode: value }),
            toggleHideCollapse: (value: boolean) => set({ hideCollapse: value }),
            toggleHideChildrenCount: (value: boolean) => set({ hideChildrenCount: value }),
            setNodeMaxLength: (value: number) => {
                set({
                    nodeMaxLength: value,
                })
            },
        }),
        {
            name: "config",
        }
    )
);

export default useStored;
