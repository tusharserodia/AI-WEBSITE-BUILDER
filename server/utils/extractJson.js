const extractJson = async ( text ) => {
   if(!text){
    return 
   }

   const cleaned= text.
        replace(/```json/gi, "")
       .replace(/```/g, "")
       .trim();

    const firstBrace = cleaned.indexOf('{');   
    const closedBrace = cleaned.lastIndexOf('}');
    if(firstBrace === -1 || closedBrace === -1){
        return null;
    }   

    const jsonString = cleaned.slice(firstBrace, closedBrace+1);
    // return JSON.parse(jsonString)
    console.log(jsonString);
}

export default extractJson;