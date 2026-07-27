// import { generateResponse } from "../config/openRouter.js";
import { generateResponse } from "../config/openRouter.js";
import extractJson from "../utils/extractJson.js";

export const getCurrentUser = async(req, res) => {
    try {
        if(!req.user){
            return res.json({user: null});
        }              
        return res.json(req.user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `get Current User ${error}`
        });
    }
}

export const generateDemo = async (req , res) => {
    try {
        const result = await generateResponse("hello");
        // const data = await extractJson(result);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message
        });
    }
}