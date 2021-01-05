$('#productImage').on('change', function(){
    let image = $("#productImage")[0].files[0];
    let formdata = new FormData();
    formdata.append('productImage', image);
    $.ajax({
        url: '/admin/upload',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        'success':(data) => {
            $('#img').attr('src', data.file);
            $('#imageurl').attr('value', data.file);// sets posterURL hidden field
        }
    });
});