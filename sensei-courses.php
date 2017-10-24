<?php
/**
 * Plugin Name: Sensei Courses
 * Plugin URI: https://docs.woocommerce.com/document/sensei-shortcodes/
 * Description: A list of courses
 * Author: Automattic
 * Author URI: https://automattic.com/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package SUM
 */

function sensei_courses_enqueue_block_editor_assets() {
	wp_enqueue_script(
		'sensei-courses',
		plugins_url( 'block.build.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
		'1.0.0'
	);

	wp_enqueue_style(
		'sensei',
		Sensei()->plugin_url . 'assets/css/frontend/sensei.css',
		array( 'wp-blocks' ),
		'1.0.0'
	);

	wp_enqueue_style(
		'sensei-editor',
		plugins_url( 'editor.css', __FILE__ ),
		array( 'wp-blocks' ),
		'1.0.0'
	);
}

add_action( 'enqueue_block_editor_assets', 'sensei_courses_enqueue_block_editor_assets' );

function sensei_render_courses( $attributes ) {
	global $wp_query;

	$query_args = array(
		'post_type'        => 'course',
		'post_status'      => 'publish',
		'orderby'          => 'date',
		'order'            => 'desc',
		'posts_per_page'   => '10',
	);

	$query = new WP_Query( $query_args );
	$current_global_query = $wp_query;
	$wp_query = $query;

	ob_start();
	Sensei_Templates::get_template('loop-course.php');

	$shortcode_output =  ob_get_clean();
	$wp_query = $current_global_query;

	return $shortcode_output;
}

register_block_type( 'sensei/courses', array(
	'render_callback' => 'sensei_render_courses',
) );
