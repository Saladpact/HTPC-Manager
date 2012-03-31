$(document).ready(function () {
    loadRecentMovies();
    loadRecentTVshows();
    loadNextAired();
    loadWantedMovies();
    loadRecentAlbums();
    loadInfo();
});

function loadInfo() {

    /**
     * DISK Info
     */
    $.ajax({
        url: '/json/?which=sabnzbd&action=status',
        type: 'get',
        dataType: 'json',
        success: function (object, textStatus) {
            var data = object.queue;

            var i = 1;
            while (true) {

                var disk = eval('data.diskspace' + i);
                var disk_total = eval('data.diskspacetotal' + i);

                if (disk != undefined && disk_total != undefined) {

                    var diskspace = 100 - (disk / (disk_total / 100));

                    var title = $('<h5>').html('HDD' + i);
                    var subTitle = $('<small>').html(' - ' + Math.round(diskspace) + '% used, ' + disk + ' G / ' + disk_total + ' G free');
                    title.append(subTitle);
                    $('#hdd-info').append(title);

                    var progress = $('<div>').addClass('progress');
                    var progressBar = $('<div>').addClass('bar').width(diskspace + '%');
                    progress.append(progressBar);

                    $('#hdd-info').append(progress);

                    i++;
                } else {
                    break;
                }
            }
        }
    });

    /**
     * Now Playing Info
     */

}

function loadRecentMovies () {
    $.ajax({
        url: 'json/?which=xbmc&action=recentmovies',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if (data == null) {
                return false;
            }
            $.each(data.movies, function (i, movie) {

                var itemDiv = $('<div>');
                itemDiv.addClass('item');
                if (i == 0) {
                    itemDiv.addClass('active');
                }
                var itemImage = $('<img>');
                itemImage.attr('src', 'json/?which=xbmc&action=thumb&thumb=' + encodeURIComponent(movie.fanart) + '&h=240&w=430');
                itemImage.attr('alt', movie.title);

                var itemTitle = $('<h4>');
                itemTitle.html(movie.title);

                var itemPlot = $('<p>');
                itemPlot.html(shortenText(movie.plot, 100));
                var itemCaption = $('<div>');
                itemCaption.addClass('carousel-caption');

                itemCaption.append(itemTitle);
                itemCaption.append(itemPlot);
                itemCaption.css('cursor', 'pointer');
                itemCaption.click(function () {
                    xbmcShowMovie(movie)
                });

                itemDiv.append(itemImage);
                itemDiv.append(itemCaption);

                $('#movie-carousel').show();
                $('#movie-carousel .carousel-inner').append(itemDiv);

            });
        }
    });
}

function loadRecentTVshows () {
    $.ajax({
        url: 'json/?which=xbmc&action=recentshows',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if (data == null) {
                return false;
            }
            $.each(data.episodes, function (i, episode) {

                var epTitle = episode.season + 'x' + episode.episode + ' ' + episode.label;

                var itemDiv = $('<div>');
                itemDiv.addClass('item');
                if (i == 0) {
                    itemDiv.addClass('active');
                }
                var itemImage = $('<img>');
                itemImage.attr('src', 'json/?which=xbmc&action=thumb&thumb=' + encodeURIComponent(episode.fanart) + '&h=240&w=430');
                itemImage.attr('alt', epTitle);
                var itemTitle = $('<h4>');
                itemTitle.html(epTitle);
                var itemPlot = $('<p>');
                itemPlot.html(shortenText(episode.plot, 100));
                var itemCaption = $('<div>');
                itemCaption.addClass('carousel-caption');

                itemCaption.append(itemTitle);
                itemCaption.append(itemPlot);
                itemCaption.css('cursor', 'pointer');
                itemCaption.click(function () {
                    xbmcShowEpisode(episode)
                });

                itemDiv.append(itemImage);
                itemDiv.append(itemCaption);

                $('#tvshow-carousel').show();
                $('#tvshow-carousel .carousel-inner').append(itemDiv);

            });
        }
    });
}

function loadRecentAlbums () {
    $.ajax({
        url: 'json/?which=xbmc&action=recentalbums',
        type: 'get',
        dataType: 'json',
        success: function (data) {

            if (data == null) {
                return false;
            }

            $.each(data.albums, function (i, album) {
                if (i > 3) {
                    return;
                }

                var itemImage = $('<img>');
                itemImage.css({
                    width: '30px',
                    height: '30px'
                });
                if (album.thumbnail == '') {
                    itemImage.attr('src', 'img/white5x5.png');
                } else {
                    itemImage.attr('src', 'json/?which=xbmc&action=thumb&thumb=' + encodeURIComponent(album.thumbnail) + '&h=30&w=30');
                }

                var row = $('<tr>')
                row.append($('<td>').html(itemImage));
                row.append($('<td>').html(album.artist));
                row.append($('<td>').html(album.label));
                row.append($('<td>').html(album.year));

                $('#album-table-body').append(row);

            });
        }
    });
}

function loadWantedMovies() {
    $.ajax({
        url: '/json/?which=couchpotato&action=movielist',
        type: 'get',
        dataType: 'json',
        success: function (result) {

            if (result == null) {
                var row = $('<tr>')
                row.append($('<td>').html('No wanted movies found').attr('colspan', '2'));
                $('#wantedmovies_table_body').append(row);
                return false;
            }

            $.each(result.movies, function(i, item) {

                var row = $('<tr>');
                row.append($('<td>').html(item.library.info.original_title));
                row.append($('<td>').html(item.library.year));

                $('#wantedmovies_table_body').append(row);

            });

        }
    });
}