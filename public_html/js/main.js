$(function(){
    $(".souhrn").parent().remove();
    //generates chart from input after img select
    $("#imgInp").on("change",function(e){
        var img = getImage(e.target);
        img.onload = function(){
            $("#imgView").remove();
            $("#imgWrapper")
                .append($('<img id="imgView" class="img-responsive" alt="image view">')
                .css("display","none")
                .attr("src",img.src)
                .fadeIn(800));
            drawChart(img);
        };
    });
    
    //sidebar menu animation
    var menu = 0;
    $(".sidebar-button").click(function(){
        if (menu === 0) {
            menu++;
            $(".sidebar").animate({left:'-150px'},800);
            $(".sidebar-button span")
                .removeClass("glyphicon-menu-left")
                .addClass("glyphicon-menu-right");
        }else {
            menu--;
            $(".sidebar").animate({left:'0px'},800);
            $(".sidebar-button span")
                .removeClass("glyphicon-menu-right")
                .addClass("glyphicon-menu-left");
        }
    });
    
    //clear animation
    $("#clearBtn").click(function(){
       $("#imgView").fadeOut(500);
       $("#chart").fadeOut(500);
    });
});

/*
 * Gets image from input[type=file]
 * @param {File} input
 * @returns {mainL#7.img|Image}
 */
function getImage(input){
    var img = new Image();
    
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
    
    return img;
}

/*
 * Gets RGB values from image
 * @param {Object} img
 * @returns {Array} RGB
 */
function getRGB(img){
    //draw image in hidden canvas
    var cvs = document.getElementById("imgCvs");
    var ctx = cvs.getContext("2d");
    cvs.width = img.width;
    cvs.height = img.height;
    ctx.drawImage(img,0,0);

    //add up RGB values
    var imgData = ctx.getImageData(0,0,cvs.width,cvs.height);
    var r = 0;
    var g = 0;
    var b = 0;
    for (var i = 0; i < imgData.data.length; i+=4) {
        r = imgData.data[i] + r;
        g = imgData.data[i+1] + g;
        b = imgData.data[i+2] + b;
    }
        
    //return percentage
    return [(r / (r+g+b) * 100).toFixed(2),(g / (r+g+b) * 100).toFixed(2),(b / (r+g+b) * 100).toFixed(2)];
}

/*
 * Draws pie chart
 * @param {Object} img
 * @returns {Object} chart
 */
function drawChart(img){
    //reset canvas element
    var chartWrapper = $("#chartWrapper");
    chartWrapper.children().remove();
    chartWrapper.append($('<canvas></canvas>').attr("id","chart"));

    //get context and fill data
    var chartCtx = document.getElementById("chart").getContext("2d");
    var chartData = {
        labels:["Red %","Green %","Blue %"],
        datasets:[{
            data:getRGB(img),
            backgroundColor: [
                'rgba(255, 99, 132, 1)',    //r
                'rgba(75, 192, 192, 1)',    //g
                'rgba(54, 162, 235, 1)'     //b
            ],
            hoverBackgroundColor: [
                'rgba(255, 99, 132, 0.5)',  //r
                'rgba(75, 192, 192, 0.5)',  //g
                'rgba(54, 162, 235, 0.5)'   //b
            ],
            borderWidth: 1
        }]
    };

    //draw chart
    var chart = new Chart(chartCtx,{
        type:'pie',data:chartData
    });
    
    return chart;
}

