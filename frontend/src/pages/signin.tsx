import { Auth } from "../components/auth";
import { Quote } from "../components/quote";

export function Signin (){
    return <div className="grid grid-cols-2">
        <div>
            <Auth type="signin"/>
        </div>
        <div className="invisible md:visible">
            <Quote/>
        </div>
    </div>
}