async function getCurrentTab() 
{
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
let setImg; let radBtns;
AllTogether();

async function AllTogether()
{
    const tab = await getCurrentTab();
    if(!tab.url.includes('twitch.tv'))
    {
        document.body.innerHTML="<p id=\"alertP\">Not Twitch page!</p>";
    }else
    {
        setImg = document.querySelector('#settingImg');
        GetDataFromStorage("setImgPath").then(path=>{
            if(path!=null)
            setImg.src=path;
            else{
                SetDataToStorage({"setImgPath": '../img/OnBtnNonActive.png'});
                setImg.src='../img/OnBtnNonActive.png';
            }
        });
        setImg.addEventListener('click', function(){
            ChangeImgPath();
            ActiveScanning();
        });

        radBtns= document.getElementsByName('r1');
        SetActiveRadioBtn();
        
        for(let i=0; i<radBtns.length; i++)
        {
            radBtns[i].onchange= function()
            {
                SetDataToStorage({"fileNameOfAlert": radBtns[i].value});
                chrome.tabs.sendMessage(tab.id, "ChangeSound");     
                SetDataToStorage({"indexOfActiveRadioBtn": i});
            }
        }

        async function SetActiveRadioBtn()
        {
          let index = await GetDataFromStorage("indexOfActiveRadioBtn");
           if(index==null)
          {
            index=0;
            SetDataToStorage({"indexOfActiveRadioBtn": 0});
            SetDataToStorage({"fileNameOfAlert": radBtns[0].value});
          }
          radBtns[index].checked=true;
        }
    }
}

function ActiveScanning()
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
        {
            chrome.tabs.sendMessage(tabs[0].id, 'CheckTimer');
        });  
}

async function ChangeImgPath()
{
    if(setImg.src.includes('Non'))
    { 
        setImg.src='../img/OnBtnActive.png';
        SetDataToStorage({"setImgPath": setImg.src});
    }
    
    else 
    {
        SetDataToStorage({"indexOfActiveRadioBtn": 0});
        SetDataToStorage({"fileNameOfAlert": radBtns[0].value});
        const tab = await getCurrentTab();
        chrome.tabs.sendMessage(tab.id, "ChangeSound");  
        setImg.src='../img/OnBtnNonActive.png'
        SetDataToStorage({"setImgPath": setImg.src});
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