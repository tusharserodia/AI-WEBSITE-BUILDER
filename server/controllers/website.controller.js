import { generateResponse } from "../config/openRouter.js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";
import slugify from "slugify";

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;

export const generateWebsite =async(req, res)=> {
  try {
    const {prompt} = req.body;
    const slug = slugify(prompt.slice(0, 60), {lower: true, strict: true,}) + "-" + Date.now();
    if(!prompt){
        return res.status(400).json({
            success: false,
            message: "prompt is required"
        })
    }
    const user = await User.findById(req.user._id);
    // console.log(user);
    if(!user){
        return res.status(400).json({
            success: false,
            message: "user not found!!, maybe not authenticated!!"
        })
    }

    if(user.credits<50){
        return res.status(400).json({
            success: false,
            message: "you have not enough credits to generate the website!!"
        })
    }

    const finalPrompt = masterPrompt.replace("USER_PROMPT", prompt);
    let raw = "";

    let parsed = null;
    for(let i=0;i< 2 && !parsed;i++){
       raw= await generateResponse(finalPrompt);
      //  parsed = await extractJson(raw);
       if(!raw){
         raw= await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON.");
        //  parsed = await extractJson(raw);
       }
       console.log(raw);
      //  console.log(parsed);
    }
    // raw = await generateResponse(finalPrompt);

    if(!raw.code){
        console.log("ai returned invalid response", raw);
        return res.status(400).json({
            message: "ai returned invalid response"
        })
    }

    const website = await Website.create({
        user: user._id,
        title: prompt.slice(0, 60),
        slug,
        latestCode: raw.code,
        conversation: [
            {
                role: "user",
                content: prompt
            }
           ,{
               role:  "ai",
               content: raw.message
            }
            
        ]
    })

    user.credits = user.credits-25;
    await user.save();

    return res.status(201).json({
        success: true,
        message: "Website generated",
        websiteId: website._id,
        remainingCredits: user.credits
    })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
            success: false,
            message: `generate website error ${error}`
        })
    }
}


// export const generateDemo = async (req , res) => {
//     try {
//         const result = await generateResponse("hello");
//         const data = await extractJson(result)
//         return res.status(200).json(data);
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// }

export const getWebsiteById= async (req, res) =>{
     try {
      const id = req.params.id.trim();
      const website = await Website.findOne({
          _id: id,
          user: req.user._id
      })

      if(!website){
        return res.status(400).json({
          message: "Website not found!!!"
        })
      }
      return res.status(200).json(website);
     } catch (error) {
         console.log(error.message);
          return res.status(500).json({
            success: false,
            message: `get website by id error ${error}`
        })
    }      
}


export const changes = async (req, res) => {
  try {
     const {prompt} = req.body;
    if(!prompt){
        return res.status(400).json({
            success: false,
            message: "prompt is required"
        })
    }

    const websiteId  =req.params.id.trim();
    const website = await Website.findOne({
          _id: websiteId,
          user: req.user._id
    })  
    if(!website){
      return res.status(400).json({
        message: "website not found!!"
      })
    }
    const user = await User.findById(req.user._id);
    // console.log(user);
    if(!user){
        return res.status(400).json({
            success: false,
            message: "user not found!!"
        })
    }

    if(user.credits<25){
        return res.status(400).json({
            success: false,
            message: "you have not enough credits to generate the website!!"
        })
    }   

    const updatePrompt = `
      UPDATE THIS HTML WEBSITE.


      CURRENT CODE:
      ${website.latest}
      
      USER REQUEST
      ${prompt}

      RETURN RAW JSON ONLY:
      {
         "message": "short confirmation",
         "code" : "<UPDATED FULL HTML>" 
      }
    `

    let raw = "";

    // let parsed = null;
    for(let i=0;i< 2;i++){
       raw= await generateResponse(updatePrompt);
      //  parsed = await extractJson(raw);
       if(!raw){
         raw= await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON.");
        //  parsed = await extractJson(raw);
       }
       console.log(raw);
      //  console.log(parsed);
    }
    // raw = await generateResponse(finalPrompt);

    if(!raw.code){
        console.log("ai returned invalid response", raw);
        return res.status(400).json({
            message: "ai returned invalid response"
        })
    }

    website.conversation.push({
      role: "user", content: prompt
    }, {
       role: "ai", content: raw.message
    })
    website.latestCode = raw.code

    await website.save();
    user.credits = user.credits - 10;
    await user.save();

    return res.status(200).json({
      message: raw.message,
      code: raw.code,
      remainingCredits: user.credits 
    })

  } catch (error) {
    console.log(error.message);
          return res.status(500).json({
            success: false,
            message: `changes failed in website generation error: ${error}`
        })
  }
}

export const getAll = async (req, res) => {
  try {
    const websites = await Website.find({user:req.user._id});
    return res.status(200).json(websites);
  } catch (error) {
     console.log(error.message);
          return res.status(500).json({
            success: false,
            message: `Failed to get all the websites: ${error}`
      })
  }
}

export const deploy = async (req, res) => {
  try{
     const websiteId  =req.params.id.trim();
    const website = await Website.findOne({
          _id: websiteId,
          user: req.user._id
    })  
    if(!website){
      return res.status(400).json({
        message: "website not found!!"
      })
    }
    if(!website.slug){
      website.slug = website.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60)+website._id.toString().slice(-5);
    }
    website.deployed = true;
    website.deployUrl= `${process.env.FRONTEND_URL}/site/${website.slug}`

    await website.save();

    return res.status(200).json({
      message: true,
      url: website.deployUrl
    })
  }catch(error){
     console.log(error.message);
          return res.status(500).json({
            success: false,
            message: `deploy website error: ${error}`
      })
  }
}

export const getBySlug = async(req, res) => {
  try{
    const website = await Website.findOne({
      slug: req.params.slug,
      user: req.user._id
    })

    if(!website){
      return res.status(400).json({
        success: false,
        message: "Not Get the website by slug" 
      })
    }
    return res.status(200).json({
        success: true,
        message: "Get the website by slug",
        website 
      })
  }catch(error){
    console.log(error.message);
    return res.status(500).json({
            success: false,
            message: `get by slug error: ${error}`
      })
  }
}