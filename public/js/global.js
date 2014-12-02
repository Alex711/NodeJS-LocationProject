var userListData = [];






$(document).ready(function() {
      $('#btnAddUser').on('click', addUser);
 
  
      populateTable();
          $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

      $('#userList table tbody').on('click', 'td a.linkdeleteitem', deleteItem);

  

});

function deleteItem() {
      event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this object?');
  
  var entryToDelete = {
            'entry': $(this).attr('rel')
  }
  
        
  
    if (confirmation === true) {
      $.ajax({
            type: 'DELETE',
            data: entryToDelete,
            url: '/deleteEntry',
            dataType: 'JSON'

        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }
              populateTable();


};

function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisUserName);
  
  var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(" " + thisUserObject.name);
    $('#userInfoAge').text(" " + thisUserObject.information);
    $('#userInfoGender').text(" " + thisUserObject.lat);
    $('#userInfoLocation').text(" " + thisUserObject.lon);

};


      
  


function populateTable() {

    // Empty content string
    var tableContent = '';


    // jQuery AJAX call for JSON
    $.getJSON( '/getlocations', function( data ) {
        userListData = data;
     if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
       $('td:nth-child(3),th:nth-child(3)').hide();
       $('td:nth-child(4),th:nth-child(4)').hide();
       $('td:nth-child(5),th:nth-child(5)').hide();  
       $('td:nth-child(6),th:nth-child(6)').hide();       




            
    $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" data-toggle="modal" data-target="#basicModal" rel="' + this.name + '" title="Show Details">' + this.name + '</a></td>';
            tableContent += '<td>' + this.information + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteitem" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
       
       
     } else {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" data-toggle="modal" data-target="#basicModal" rel="' + this.name + '" title="Show Details">' + this.name + '</a></td>';
            tableContent += '<td>' + this.information + '</td>';
            tableContent += '<td>' + this.lat + '</td>';
            tableContent += '<td>' + this.lon + '</td>';
            tableContent += '<td><button onclick="viewLocationOnMap()">View on map</button></td>';
            tableContent += '<td>In Progress</button></td>';
            tableContent += '<td><a href="#" class="linkdeleteitem" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
     }

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
        pager = new Pager('results', 5);
pager.init();
pager.showPageNav('pager', 'pageNavPosition');
pager.showPage(1);
      
      // pagination object codes.
function Pager(tableName, itemsPerPage) {
    this.tableName = tableName;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = 0;
    this.inited = false;

    this.showRecords = function (from, to) {
        var rows = document.getElementById(tableName).rows;
        // i starts from 1 to skip table header row
        for (var i = 1; i < rows.length; i++) {
            if (i < from || i > to) rows[i].style.display = 'none';
            else rows[i].style.display = '';
        }
    }

    this.showPage = function (pageNumber) {
        if (!this.inited) {
            alert("not inited");
            return;
        }

        var oldPageAnchor = document.getElementById('pg' + this.currentPage);
        oldPageAnchor.className = 'pg-normal';

        this.currentPage = pageNumber;
        var newPageAnchor = document.getElementById('pg' + this.currentPage);
        newPageAnchor.className = 'pg-selected';

        var from = (pageNumber - 1) * itemsPerPage + 1;
        var to = from + itemsPerPage - 1;
        this.showRecords(from, to);
    }

    this.prev = function () {
        if (this.currentPage > 1) this.showPage(this.currentPage - 1);
    }

    this.next = function () {
        if (this.currentPage < this.pages) {
            this.showPage(this.currentPage + 1);
        }
    }

    this.init = function () {
        var rows = document.getElementById(tableName).rows;
        var records = (rows.length - 1);
        this.pages = Math.ceil(records / itemsPerPage);
        this.inited = true;
    }

    this.showPageNav = function (pagerName, positionId) {
        if (!this.inited) {
            alert("not inited");
            return;
        }
        var element = document.getElementById(positionId);
        var pagerHtml = '<span onclick="' + pagerName + '.prev();" class="pg-normal"> &#171 Prev </span> | ';
        for (var page = 1; page <= this.pages; page++)
            pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span> | ';
        pagerHtml += '<span onclick="' + pagerName + '.next();" class="pg-normal"> Next &#187;</span>';
        element.innerHTML = pagerHtml;
    }
}
      
          

    });
};

function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'name': $('#addUser form.fieldset input#inputUserName').val(),
            'information': $('#addUser form.fieldset input#inputUserEmail').val(),
            'latitude': $('#addUser form.fieldset input#inputUserFullname').val(),
            'longitude': $('#addUser form.fieldset input#inputUserAge').val()
            
        }
        

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/insertLocation',
            dataType: 'JSON'
        }).done(function( response ) {
          alert("in the response bit");

            // Check for successful (blank) response
            if (response.msg === '') {
                            populateTable();


                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
            console.log("reacing here");
                

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
                  $('#addUser fieldset input').val('');

                populateTable();

};




