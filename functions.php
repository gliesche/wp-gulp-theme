<?php

/*
Theme functions
*/

// remove unnecessary stuff
remove_action ('wp_head', 'rsd_link');

remove_action('wp_head', 'wp_generator');

remove_action('wp_head', 'wlwmanifest_link');

remove_action( 'wp_head', 'wp_shortlink_wp_head');

// remove wpml generator
if ( ! empty ( $GLOBALS['sitepress'] ) ) {
    add_action( 'wp_head', function()
    {
        remove_action(
            current_filter(),
            array ( $GLOBALS['sitepress'], 'meta_generator_tag' )
        );
    },
    0
    );
}

// register scripts
function flix_scripts() {
  // register scripts
  wp_register_script('modernizr', get_template_directory_uri() . '/assets/scripts/vendor/modernizr.min.js',null,'', false ); 
  wp_register_script('plugins', get_template_directory_uri() . '/assets/scripts/plugins.min.js',null,'', false ); 
  wp_register_script('flix', get_template_directory_uri() . '/assets/scripts/build.min.js', array( 'jquery', 'modernizr', 'plugins'),filemtime( get_template_directory().'/assets/scripts/build.min.js'), true ); 
  
  // enqueue them (conditionally if necessary)
  wp_enqueue_script('flix');
}

add_action( 'wp_enqueue_scripts', 'flix_scripts' );

// register styles
function flix_styles() {
  wp_register_style( 'flix-styles',  get_template_directory_uri().'/assets/styles/styles.min.css', array(), filemtime( get_template_directory().'/assets/styles/styles.min.css' ));
  wp_enqueue_style('flix-styles');
}
add_action( 'wp_enqueue_scripts', 'flix_styles' );