
_update_zoom = ->
    test_image = document.getElementById 'test_image'
    div_scale_value = document.getElementById 'scale_value'

    zoom = retina._get_zoom_level()

    div_scale_value.innerHTML = zoom.toFixed(3) + "x"

    zoom = 1/zoom
    test_image.style['WebkitTransform'] = "scale(#{zoom},#{zoom}) translate(200px, 100px)";

    setTimeout _update_zoom, 1000

window.addEventListener "load", _update_zoom