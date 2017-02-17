var API_KEY = 'AIzaSyAh0YlO7TG-Q_-2tzmuqYgJ_7z57_AsQvc';
var endpoint = 'https://kgsearch.googleapis.com/v1/entities:search?query={QUERY}&key=' + API_KEY;

var noImageSrc = 'http://bulma.io/images/placeholders/128x128.png';

var searchResultTemplate = (function () {/*
    <div class="column">
        <div class="card">
            <div class="card-image">
                <figure class="image is-1by1">
                    <img src="{{IMG_SRC}}" style="margin: auto; height: auto">
                </figure>
            </div>
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <a href="{{URL}}">
                            <p class="title is-4">{{SEARCH_TITLE}}</p>
                        </a>
                    </div>
                </div>
                <div class="content">
                    {{SEARCH_DESCRIPTION}}
                </div>
            </div>
        </div>
    </div>
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

function createEndpoint(query) {
    return endpoint.replace('{QUERY}', query);
}

function wrapRow(elems) {
    return '<div class="columns">' + elems + '</div>';
}

function createSearchResultElement(title, description, url, imgUrl) {
    return searchResultTemplate
        .replace('{{SEARCH_TITLE}}', title)
        .replace('{{SEARCH_DESCRIPTION}}', description)
        .replace('{{URL}}', url)
        .replace('{{IMG_SRC}}', imgUrl);
}

function callKnowledgeSearch(query) {
    $('#search-results').empty();
    $.ajax({
        url: createEndpoint(query)
    })
    .done(function(response) {
        console.log(response);
        var searchResults = response.itemListElement;
        var elems = '';
        for (var i = 0 ; i < searchResults.length ; i += 1) {
            var title = searchResults[i].result.name;
            var description = searchResults[i].result.description;
            var url = searchResults[i].result.url;
            var imgUrl;
            if (searchResults[i].result.image === undefined) {
                imgUrl = noImageSrc;
            }
            else {
                imgUrl = searchResults[i].result.image.contentUrl;
            }
            elems += createSearchResultElement(title, description, url, imgUrl)            
            if (i % 4 === 3) {
                $('#search-results').append(wrapRow(elems));
                elems = '';
            }
        }
    });
}

$('#search-button').click(function () {
    var query = $('#search-key').val();
    if (query.trim().length !== 0) {
        callKnowledgeSearch(query);
    }
});
