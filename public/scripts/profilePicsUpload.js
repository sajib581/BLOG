window.onload = function(){
    let baseCropping = $('#cropped-image').croppie({
        viewport : {
            width : 200,
            height : 200
        },
        boundary : {
            width : 300 ,
            height : 300
        },
        showZoomer : true
    })

    function readableFile(file){   //grenerate readable file
        let reader = new FileReader()    // by which croppie can read file
        reader.onload = function(event){
            baseCropping.croppie('bind', {
                url : event.target.result
            }).then(() => {
                $('.cr-slider').attr({
                    'min' : 0.5000,
                    'max' : 1.5000
                })
            })
        }
        reader.readAsDataURL(file)  //reading the file as data URL
    }
    
    $('#profilePicsFile').on('change', function (e) { 
        if (this.files[0]){     //files ??
            readableFile(this.files[0]) 
            $('#crop-modal').modal({ 
                backdrop: 'static', 
                keyboard: false 
            }) 
        }
    })
    
    $('#cancel-cropping').on('click', function () { 
        $('#crop-modal').modal('hide')
         
    }) 

    $('#upload-image').on('click',function(){
        baseCropping.croppie('result','blob')
        .then(blob => {            
            let formData = new FormData() 

            let file = document.getElementById('profilePicsFile').files[0]             
            let name = generateFileName(file.name)
              
            //console.log(profilePics)   // Id of Image = profilePics                   
            formData.append('profilePics',blob,name)

            let headers = new Headers()
            headers.append('Accept','Application/JSON')

            let req = new Request('/uploads/profilePics',{  // kar link ?? keno
                method : 'POST',  // req data sends to server
                headers,
                mode : 'cors' ,  //so that no outer server can use our server 
                body : formData
            })
            return fetch(req)
        })
        .then(res => res.json() ) 
        .then(data => {

            document.getElementById('removeProfilePics').style.display='block'
            document.getElementById('profilePics').src = data.profilePics               
            document.getElementById('profilePicsForm').reset()
            
            $('#crop-modal').modal('hide')
            
        }) 
    })

    $('#removeProfilePics').on('click', function() {
        let req = new Request('/uploads/profilePics',{
            method : 'DELETE',
            mode : 'cors'
        })
        fetch(req)
            .then(res => res.json())
            .then(data =>{
                document.getElementById('removeProfilePics').style.display='none'
                document.getElementById('profilePics').src = data.profilePics
                document.getElementById('profilePicsForm').reset()
            })
            .catch( e => {
                console.log(e)
                alert('Server Error Occured')
            })
    })
}

function generateFileName(name){
    const types = /(.jpeg|.jpg|.png|.gif)/
    return name.replace(types,'.png')
}
