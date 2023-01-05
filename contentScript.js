
let injectFunc;
(async ()=>{
    const src = chrome.runtime.getURL('./test.js');
    injectFunc = await import(src);
})();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message==='CheckTimer')
    {
        CheckActiveTimer();
    }
    if(message=="ChangeSound")
    {
        LoadPathOfSoundFile();
    }
});


let audio = new Audio();
LoadPathOfSoundFile();

let speech = window.speechSynthesis;
let engVoice;

let config= {volume: 1};

function DeleteAnotherSymbols(text)
{
  return text.replace(/[^А-яЁё A-Za-z ]+/g, '');
}

function CheckLanguage(text)
{
  if(!/[а-я]/i.test(text))
    return engVoice;
  else
    return null;
}

function Speaking(text)
{
  text = DeleteAnotherSymbols(text);
  let readme = new SpeechSynthesisUtterance(text);
        readme.volume = config.volume;
        readme.voice = CheckLanguage(text);
        speech.speak(readme); 
}

async function LoadPathOfSoundFile()
{
    let fileNameOfAlert = await GetDataFromStorage("fileNameOfAlert");
    if(fileNameOfAlert==null)
    fileNameOfAlert="mainAlert.mp3";
    audio.src=chrome.runtime.getURL(`./res/${fileNameOfAlert}`);
}

function GetMsgArr()
{
    let mass = [...document.querySelectorAll('.chat-line__message')];
    return {arr: mass, countNow:mass.length};
}

function GetOneObj(mainObj)
{
    let msg = mainObj.querySelector('.text-fragment').textContent;
    let author = mainObj.querySelector('.chat-author__display-name').textContent;
    let curse = false;
    if(author=='AutoMod')
    curse = true;
    return { msg: msg,
             author: author,
             curse: curse };
}
function SoundNotification(msgObj)
{
    if(msgObj.author!='Zerotenmerth')
    {
        if(msgObj.curse!=true)
        {
            Speaking(msgObj.msg);
        }
        else audio.play();
    } 
    
}
function Global()
{
    let countMsgs =0;
    function CheckMsgs()
    {
        let {arr, countNow} = GetMsgArr();
        if(countMsgs!=countNow)
        {
           let msgObj= GetOneObj(arr[arr.length-1]);
           SoundNotification(msgObj);
           countMsgs=countNow;
        }
    }
    let timer1 = setInterval(CheckMsgs, 5000);
    SetDataToStorage({"ourTimer": timer1});
    
}

async function CheckActiveTimer()
{
    let result = await GetDataFromStorage("ourTimer");
    if(result==null)
    {
        engVoice =[...speech.getVoices()].find(item => item.name =='Google UK English Male');
        Global();
        injectFunc.injectFunction();
    }
    else 
    {
        clearInterval(result);
        SetDataToStorage({"ourTimer": null});
    }
} 

function GetDataFromStorage(symbol)
{
        return new Promise((resolve, reject)=>
        {
            chrome.storage.local.get(symbol, function(result) {
                for (key in result) {
                    if(key==symbol)
                    resolve(result[key]);
                }
                reject(null);
            });
        }).catch(err => {
        return err;
        });
}

function SetDataToStorage(obj)
{
        chrome.storage.local.set(obj, function() {

        });
}