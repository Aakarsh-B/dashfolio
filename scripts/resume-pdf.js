/* Prints resume.html to resume.pdf (A4, selectable text, so applicant tracking systems can read it).
   Runs from scripts/assets.sh after any change; skips when the resume's content hasn't changed (resume.pdf.sha),
   so the PDF isn't rewritten every day. Needs Playwright, like scripts/og.js. */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require(process.env.PLAYWRIGHT||'playwright');
const root=path.join(__dirname,'..'),out=path.join(root,'resume.pdf'),shaFile=path.join(root,'resume.pdf.sha');
(async()=>{
 const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{});
 try{
  const pg=await b.newPage();
  await pg.goto('file://'+path.join(root,'resume.html'),{waitUntil:'networkidle'});
  await pg.evaluate(()=>document.fonts.ready);
  // What's on the page (text, links, styles) decides whether a new PDF is needed; data.js changes elsewhere don't.
  const sha=crypto.createHash('sha1').update(await pg.content()).update(fs.readFileSync(path.join(root,'css/fonts.css'))).digest('hex').slice(0,16);
  if(fs.existsSync(out)&&fs.existsSync(shaFile)&&fs.readFileSync(shaFile,'utf8').trim()===sha){console.log('Resume PDF: up to date');return}
  await pg.emulateMedia({media:'print'});
  await pg.pdf({path:out,format:'A4',printBackground:true,preferCSSPageSize:true,tagged:true,outline:true});
  fs.writeFileSync(shaFile,sha+'\n');
  console.log('resume.pdf');
 }finally{await b.close()}
})();
