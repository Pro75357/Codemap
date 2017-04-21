# Codemap
Maps codes using UMLS metathesaurus API

Current state: Prototype- specific to one input scenario

Purpose: This is a proof-of concept and UI prototype for a tool that aids in matching things to standardized medical codesets using the UMLS Metathesarus REST API (https://www.nlm.nih.gov/pubs/factsheets/umlsmeta.html)

How to use it (as of 4/21/2017)
1. Have to have Meteor installed (https://www.meteor.com/)
2. Have to have your own UMLS API key (apply for one at: https://uts.nlm.nih.gov/home.html)
3. How to import API key:
 - Get API key from UMLS Website
 - RENAME apikey.js.EXAMPLE to just apikey.js
 - Edit apikey.js with new API key  (replace "API_KEY_GOES_HERE" with your real APIkey)
 
 4. run meteor in the project folder. defaults to localhost:3000
 
 5. create a new "user" which does nothing really at this point but you have to log in.
 
 6. Using the app:
  A. Import a CSV file with the exact column headings as instructed in the UI
     -- there are example files in the data folder. 
	 
  B. Click "search descriptions" to search every row at once. Stuff on the right should populate. 
    - If first code is not a good match, check the remaining results in the drop down.
    - If nothing is found or no good results, edit the search in the individual search box.
	- "Save" will save the concept with all the linked codes.
    
  C. once the table is populated to your liking, the "export" button will export a CSV all the data.
  
  Known issues:
   - the database will persist across sessions. Use "resetDB" button to wipe it. Will wipe on a new import as well.
   - user accounts are worthless
   - does not have any paging abilities- i.e. it is just one long list. Would perform poorly on larger imports. 
   
   Todo: 
    - need better way (YAML file? Dialog box?) to handle API key stuff
    - paging capabilities
    - ? make the search things hidden unless some event (edit button or similar)
