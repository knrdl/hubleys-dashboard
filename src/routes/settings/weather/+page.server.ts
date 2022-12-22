import type {Actions} from "@sveltejs/kit";
import {saveUserConfig} from "../utils";

export const load: PageServerLoad = async ({locals}) => {
    return {
        isWeatherProviderConfigured: !!locals.sysConfig.openweathermap_api_key,
    }
}
export const actions: Actions = {
    save: saveUserConfig
};
