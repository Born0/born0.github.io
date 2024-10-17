// Materialize - Initializers
$(document).ready(function () {
    $(".scrollspy").scrollSpy()
    // Initialize collapse button
    $(".button-collapse").sideNav({
        menuWidth: 190, // Default is 240
        edge: "left", // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    })

    // Scroll to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#scrollToTopBtn').fadeIn();
        } else {
            $('#scrollToTopBtn').fadeOut();
        }
    });

    $('#scrollToTopBtn').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 300);
        return false;
    });

    // Contact form submission
    $(document).on('click', '#submit', function (event) {
        // Validate name
        var name = $('#from_name').val().trim();
        if (name === '') {
            alert('Please enter your name.');
            return;
        }

        // Validate email
        var email = $('#reply_to').val().trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' || !emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Validate message
        var message = $('#message').val().trim();
        if (message === '') {
            alert('Please enter a message.');
            return;
        }

        // If all validations pass, proceed with sending the email
        sendMail(event);
    });

});

function sendMail(event) {
    event.preventDefault();

    var btn = $('#submit');
    btn.css('background-color','#a7d1cd')
    btn.text('Sending...');

    const serviceID = 'bornoahmed2-mail-service';
    const templateID = 'template-contact-form';

    var templateParams = {
        from_name: $('#from_name').val(),
        reply_to: $('#reply_to').val(),
        message: $('#message').val()
    };
    $('#from_name').val('');
$('#reply_to').val('');
$('#message').val('');
    //Add a timeout of 3 seconds before sending the email
    // setTimeout(() => {
    //     btn.text('Send Message');
    //     btn.text('Message Sent!');
    //     btn.css('background-color','#2bbbad')
    //         setTimeout(() => {
    //             btn.text('Send Message');
    //         }, 1500);
    // }, 3000);
    // return;
    emailjs.send(serviceID, templateID, templateParams)
        .then(function () {
            btn.text('Message Sent!');
            btn.css('background-color','#2bbbad')
            setTimeout(() => {
                btn.text('Send Message');
            }, 1500);
        }, function (err) {
            btn.text('Send Message');
            btn.css('background-color','#2bbbad')
            console.log(JSON.stringify(err));
            alert("There was a problem sending this message. Please try other method of communications")
        });
}