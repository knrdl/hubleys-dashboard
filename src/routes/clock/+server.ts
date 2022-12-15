import {redirect} from "@sveltejs/kit";

export async function GET({url}) {
    throw redirect(307, '/clock/stopwatch')
}
