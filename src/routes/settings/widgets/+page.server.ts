import {Actions} from "@sveltejs/kit";
import {saveUserConfig} from "../utils";

export const actions: Actions = {
    save: saveUserConfig
};
