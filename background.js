var contextMenuItem = {
    "id": "word",
    "title": "Find meaning",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.menuItemId == "word" && clickData.selectionText) {
        //check if selected word is a word and a string
        var word = clickData.selectionText;
        var reg = /\d/;

        if(reg.test(word)){
            alert('Please select a word...');
        }
        else if(typeof word === 'string' ||  word instanceof String){
            let url1 = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + word + '?key=7f55e767-1fcb-4d2b-8690-cf3b1f3e9df0';
            let url2 = 'https://api.dictionaryapi.dev/api/v1/entries/en/' + word;

            let definition;
            let phonetics;
            let s;

            fetch(url2)
                .then(response => response.json())
                .then(res => {
                    console.log(res);

                    if(res[0].meaning.noun){
                        definition = res[0].meaning.noun[0].definition;
                      }
                    else if(res[0].meaning.verb){
                      definition = res[0].meaning.verb[0].definition;
                    }
                    else if(res[0].meaning.adjective){
                      definition = res[0].meaning.adjective[0].definition;
                    }
                    else if(res[0].meaning.pronoun){
                      definition = res[0].meaning.pronoun[0].definition;
                    }
                    else if(res[0].meaning.adverb){
                      definition = res[0].meaning.adverb[0].definition;
                    }
                    definition = 'DEFINITION: ' + definition + '\n';

                    /* Phonetics */
                    if(res[0].phonetics){
                      phonetics = res[0].phonetics[0].text;
                      phonetics = 'PHONETICS: ' + phonetics + '\n';
                    }

                    // alert(definition + phonetics);

                    return fetch(url1);
                })
                .then(response => response.json())
                .then(res => {
                    let dir;
                    if(word[0] >= '0' && word[0] <= '9') dir = "https://media.merriam-webster.com/audio/prons/en/us/mp3/number/";
                    else dir = "https://media.merriam-webster.com/audio/prons/en/us/mp3/" + word[0] + "/";
                    s = dir + res[0].hwi.prs[0].sound.audio + ".mp3"; 
                    // s = '<audio controls><source type="audio/mpeg" src=' + s + '></audio>';

                    var aud = new Audio(s);
                    aud.addEventListener('ended', function() {
                      alert(definition + phonetics);
                    });

                    aud.play();
                })
        }
    }
});