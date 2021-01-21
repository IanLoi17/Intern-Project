$('#imgUpload').on('change', function() {
    let image = $("#imgUpload")[0].files[0];
    let formdata = new FormData();
    formdata.append('imgUpload', image);

    $.ajax({
        url: '/user/upload',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        'success': (data) => {
            $('#img').attr('src', data.file);
            $('#imageURL').attr('value', data.file);
        }
    });
});



$('#productImg').on('change', function() {
    let image = $("#productImg")[0].files[0];
    let formdata = new FormData();
    formdata.append('productImg', image);

    $.ajax({
        url: '/admin/upload',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        'success': (data) => {
            $('#productImg').attr('src', data.file);
            $('#productImgURL').attr('value', data.file);
        }
    });
});