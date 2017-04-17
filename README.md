# Codemap
Maps codes using UMLS metathesaurus API

README IS IN DEVELOPMENT. As is the whole app. Updated when possible.

Purpose: This is a proof-of concept and UI prototype for a tool that aids in matching things to standardized medical codesets using the UMLS Metathesarus REST API (https://www.nlm.nih.gov/pubs/factsheets/umlsmeta.html)

How to use it (as of 4/16/2017)
1. Have to have Meteor installed (https://www.meteor.com/)
2. Have to have your own UMLS API key (apply for one at: https://uts.nlm.nih.gov/home.html)
3. How to import API key:
 - Get API key from UMLS Website
 - RENAME apikey.js.EXAMPLE to just apikey.js
 - Edit apikey.js with new API key  (replace "API_KEY_GOES_HERE" with your real APIkey)
 
 4. run meteor in the project folder. defaults to localhost:3000
 
 5. create a new "user" which does nothing really at this point but you have to log in.
 
 6. Using the app:
  A. Import a 2-column CSV file with the exact column headings "Source_Code" and "Source_Desc"
     -- there are example files in the data folder. 
  B. Click "search all descriptions" to do that. Stuff on the right should populate. 
    - If first code is not a good match, check the remaining results in the drop down.
    - If nothing is found or no good results, edit the search in the individual search box.
    - there is a BUG that the displayed code here is the FIRST thing in the drop down right after the single search. It will still save the correct code if you press save and update if you pick something else.
    
    --"Search all codes" is for when you have codes with no description, or want to verify codes. This will just return a bunch of "no results" for the example dataset because those are internal codes that are otherwise meaningless (hence the app).
    
  C. once the table is populated to your liking, the "export" button will export a CSV of your data.
  
  Known issues:
   - is very slow. Would love to make asynchronous API calls but this makes errors. 
   - the database will persist across sessions. Use "resetDB" button to wipe it. Will wipe on a new import, though.
   - code display under the search box can be wrong after new single-row search. A saved code will still be correct. 
   - user accounts are worthless
   - does not have any paging abilities- i.e. it is just one long list.
   
   Todo: 
    - need better way (YAML file? Dialog box?) to handle API key stuff
    - paging capabilities
    - make it faster
    - make the search things hidden unless some event (edit button or similar)
