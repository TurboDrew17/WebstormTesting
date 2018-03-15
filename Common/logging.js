

function logging(logBorderColor, logBorderWidth) {
    var bd = document.getElementsByTagName("body")[0];
    var lw = document.getElementById("log-window");
    if(!lw) {
        // console.log(bdA.length);
        // console.log(bdA);
        // console.log(bdA[0]);
        bd.insertAdjacentHTML("beforeend", "<div id='log-window'></div>");
        lw = document.getElementById("log-window");
    }
    lw.style.borderStyle = "solid";
   // lw.style.borderWidth = "17px";
    if(logBorderWidth) {
        lw.style.borderWidth = logBorderWidth + "px";
    } else {
        lw.style.borderWidth = "7px";
    }
    if(logBorderColor) {
        lw.style.borderColor = logBorderColor;
    } else {
        lw.style.borderColor = "lightgreen";
    }
    
    var styl =
        "<style>"+
        "table.grid, table.grid th, table.grid td {"+
        "    border-style: solid;"+
        "    border-collapse: collapse;"+
        "    border-width: 2px;"+
        "    border-color: blue;"+
        "    padding: 5px;"+
        "    /*text-align: right;*/"+
        "} "+
        ".num-cell { text-align: right;}"
        "</style>";

    bd.insertAdjacentHTML("afterbegin", styl);


    function row_string(aaa) {

        var row = ("<tr>")
        for(var i = 0; i < arguments.length; i++ ) {
             row += "<td class='num-cell'>" + arguments[i].toFixed(3) + "</td>";
        }
        row += "</tr>";
        return row
    };
    return {
        insert: function (message) {
            lw.insertAdjacentHTML("beforeend", message);
        },

        log: function (message) {
            this.insert("<p>" + message + "</p>");
            // lw.insertAdjacentHTML("beforeend", "<p>" + message + "</p>");
        },


        logm: function (m) {
            // adapted from printm in Angel's text
            // Interactive Computer Graphics
            var tab = "<table class='grid'>";
            if (m.length == 2)
                for (var i = 0; i < m.length; i++)
                    tab += row_string(m[i][0], m[i][1]);
            else if (m.length == 3)
                for (var i = 0; i < m.length; i++)
                    tab += row_string(m[i][0], m[i][1], m[i][2]);
            else if (m.length == 4)
                for (var i = 0; i < m.length; i++)
                    tab += row_string(m[i][0], m[i][1], m[i][2], m[i][3]);
            tab += "</table>";
            this.insert(tab);
        },

        logv: function (v) {
            // adapted from printm in Angel's text
            // Interactive Computer Graphics
            var tab = "<table class='grid'>";
            if (v.length == 2)
                tab += row_string(v[0], v[1]);
            else if (v.length == 3)
                tab += row_string(v[0], v[1], v[2]);
            else if (v.length == 4)
                tab += row_string(v[0], v[1], v[2], v[3]);
            tab += "</table>";
            this.insert(tab);
        },

        separator: function() {
            this.insert("<hr/>");
        },

        clear: function() {
            lw.innerHTML = "";
        }

    }
}