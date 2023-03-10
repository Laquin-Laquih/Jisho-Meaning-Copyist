function fallbackCopyTextToClipboard(text)
{
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try
    {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        if (msg == 'unsuccessful') {
            console.log('Fallback: Copying text command was ' + msg);
        }
    } catch (err)
    {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyButtonHandler()
{
    var parentElement = this.parentElement;
    var meanings = parentElement.getElementsByClassName('meaning-wrapper');
    var completeMeaning = "";
    for (var i = 0; i < meanings.length; i++)
    {
        var index = meanings[i].getElementsByClassName('meaning-definition-section_divider')[0];
        if (!index)
        {
            continue;
        }
        var meaning = meanings[i].getElementsByClassName('meaning-meaning')[0];
        completeMeaning += index.innerText + meaning.innerText + "\n";
    }

    //remove last \n
    completeMeaning = completeMeaning.substring(0, completeMeaning.length - 1);

    //copy to clipboard
    fallbackCopyTextToClipboard(completeMeaning);
}

function readingButtonHandler()
{
    var parentElement = this.parentElement;
    var furigana = parentElement.getElementsByClassName('furigana')[0];
    var text = parentElement.getElementsByClassName('text')[0].innerHTML.trim();
    var furiganaTexts = [];

    for (const child of furigana.children)
    {
        if (child.innerText != "")
        {
            furiganaTexts.push(child.innerText);
        }
    }

    var reading = "";
    var j = 0;

    for(var i = 0; i < text.length; ++i)
    {
        var c = text.charAt(i);
        if (c == '<')
        {
            reading += text.charAt(i+6);
            i += 13;
        }
        else
        {
            if(j >= furiganaTexts.length)
            {
                console.error("Error: furiganaTexts.length < text.length");
                return;
            }
            reading += furiganaTexts[j];
            ++j;
        }
    }

    fallbackCopyTextToClipboard(reading);
}

//create copy button
var copyButton = document.createElement('button');
copyButton.style = 'background-color:#E3EFE8; border-radius:2px; padding:8px; font-family:"Courier New", monospace; font-size:18px; margin:20px;'
copyButton.className = 'copy-button';
copyButton.title = 'Copy to clipboard';
copyButton.innerText = 'Copy';

meaningWrappers = document.getElementsByClassName("meanings-wrapper");
for (var i = 0; i < meaningWrappers.length; i++)
{
    meaningWrappers[i].appendChild(copyButton.cloneNode(true));
}

//add event listener to copy button
var copyButtons = document.getElementsByClassName('copy-button');
for (var i = 0; i < copyButtons.length; i++)
{
    copyButtons[i].addEventListener('click', copyButtonHandler);
}

//create reading button
var readingButton = document.createElement('button');
readingButton.style = 'background-color:#E3EFE8; border-radius:2px; padding:8px; font-family:"Courier New", monospace; font-size:18px; margin:20px;'
readingButton.className = 'reading-button';
readingButton.title = 'Copy to clipboard';
readingButton.innerText = 'Reading';

var representations = document.getElementsByClassName("concept_light-representation");
for (var i = 0; i < representations.length; i++)
{
    representations[i].appendChild(readingButton.cloneNode(true));
}

//add event listener to reading button
var readingButtons = document.getElementsByClassName('reading-button');
for (var i = 0; i < readingButtons.length; i++)
{
    readingButtons[i].addEventListener('click', readingButtonHandler);
}