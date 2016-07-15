$(document).ready(function() {
    $('#search-toggle').on('click', function() {
        $('#search-input').addClass('open').focus();

    });
    $('#search-input').on('keyup', toggleClear);
    $('#search-input').on('submit', onSubmit);
    $('#form').submit(onSubmit);
    $('#search-clear').on('click', clearInput);

    $('.random-article-btn').on('click', getRandomArticle);

    function clearInput() {
        $('#search-input').focus().val('');
        toggleClear();

    }

    function showLoader() {
        $('#search-input').attr('disabled', 'disabled');
        $('.loader').addClass('show');
        $('#search-clear').removeClass('show');
    }

    function hideLoader() {
        var input_length = $('#search-input').val().length;
        $('#search-input').removeAttr('disabled');
        $('.loader').removeClass('show');
        if (input_length > 0) {
            $('#search-clear').addClass('show');
        }
        $('#search-input').focus();
    }

    function toggleClear() {
        var input_length = $('#search-input').val().length;
        if (input_length > 0) {
            $('#search-clear').addClass('show');

        } else {
            $('#search-clear').removeClass('show');
        }
        hideError();
    }

    function showError(errorText) {
        $('#error').text(errorText).show();
    }

    function hideError() {
        $('#error').hide();
    }

    function showResult(result) {
        var html = '<div class="result">' +
            '<a target="_blank" href="https://en.wikipedia.org/?curid=' + result['pageid'] + '">' +
            '<h2>' + result['title'] + '</h2>' +
            '<p>' + result['extract'] + '</p>' +
            '</a>' +
            '</div>';
        $('#search-results').append(html);
    }

    function clearResult() {
        $('#search-results').empty();
    }

    function onSubmit() {
        var input = $('#search-input').val();

        showLoader();
        $.ajax({
            crossDomain: true,
            dataType: 'jsonp',
            type: 'POST',
            url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=' + encodeURIComponent(input),
            success: function(data) {
                var query = data['query'];
                clearResult();
                if (query == undefined) {
                    showError('No result matches the query');
                } else {

                    for (var i in query['pages']) {
                        var result = query['pages'][i];
                        showResult(result);
                    }
                }
                hideLoader();
            },
            error: function() {
                hideLoader();
                clearResult();
                showError('An Error occurred!');
            }
        });
        return false;
    }

    function getRandomArticle() {
        hideError();
        $.ajax({
            crossDomain: true,
            dataType: 'jsonp',
            type: 'POST',
            url: 'https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=100&format=json',
            success: function(data) {
                var query = data['query'];
                clearResult();

                for (var i in query['pages']) {
                    var result = query['pages'][i];
                    showResult(result);
                }
            },
            error: function() {
                clearResult();
                showError('An Error occurred!');
            }
        });
    }

});