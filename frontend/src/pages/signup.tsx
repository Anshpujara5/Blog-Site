import { Quote } from "../components/quote";
import { Auth } from "../components/auth";

export function Signup (){
    return <div className="grid grid-cols-2">
        <div>
            <Auth type="signup"/>
        </div>
        <div className="invisible md:visible">
            <Quote/>
        </div>
    </div>
}