
$(document).ready(function () {
    // Load sections
    $('#about').load('views/sections/about.html');
    $('#experience').load('views/sections/experience.html');
    $('#skills').load('views/sections/skills.html');
    $('#education').load('views/sections/education.html');
    $('#projects').load('views/sections/projects.html');
    $('#contact').load('views/sections/contact.html');


    // Smooth scrolling
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });

    // Navbar active state
    $(window).scroll(function () {
        var scrollDistance = $(window).scrollTop();
        $('section').each(function (i) {
            if ($(this).position().top <= scrollDistance + 100) {
                $('.navbar-nav a.active').removeClass('active');
                $('.navbar-nav a').eq(i).addClass('active');
            }
        });
    }).scroll();

    // Contact form submission
    $(document).on('click', '#submit', function (event) {
        sendMail(event);
    });

});


function sendMail(event) {
    event.preventDefault();

    var btn = $('#submit');
    btn.text('Sending...');

    const serviceID = 'bornoahmed2-mail-service';
    const templateID = 'template-contact-form';

    var templateParams = {
        from_name: $('#from_name').val(),
        reply_to: $('#reply_to').val(),
        message: $('#message').val()
    };
    // Add a timeout of 3 seconds before sending the email
    setTimeout(() => {
        btn.text('Send Message');
        alert('Sent!');
    }, 3000);
    // emailjs.send(serviceID, templateID, templateParams)
    //     .then(function () {
    //         btn.text('Send Message');
    //         alert('Sent!');
    //     }, function (err) {
    //         btn.text('Send Message');
    //         alert(JSON.stringify(err));
    //     });
}