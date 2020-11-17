<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Course renderer.
 *
 * @package    theme_abierta
 * @copyright  2020 David Herney
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace theme_abierta\output\core;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/course/renderer.php');

use moodle_url;
use html_writer;
use core_course_category;
use coursecat_helper;
use stdClass;
use core_course_list_element;
use theme_abierta\util\extras;

/**
 * Course renderer class.
 *
 * @package    theme_abierta
 * @copyright  2020 David Herney
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class course_renderer extends \core_course_renderer {


    /**
     * Render course tiles in the fron page
     *
     * @param coursecat_helper $chelper
     * @param string $course
     * @param string $additionalclasses
     * @return string
     */
    protected function coursecat_coursebox(coursecat_helper $chelper, $course, $additionalclasses = '') {
        global $CFG, $OUTPUT, $PAGE;

        $showcourses = $chelper->get_show_courses();

        if ($showcourses <= self::COURSECAT_SHOW_COURSES_COUNT) {
            return '';
        }

        if ($course instanceof stdClass) {
            $course = new core_course_list_element($course);
        }

        $content = '';

        $classes = trim($additionalclasses);

        // Display course tiles depending the number per row.
        $content .= html_writer::start_tag('div',
              array('class' => 'panel panel-default coursebox ' . $classes));

        // This gets the course image or files.
        $content .= $this->coursecat_coursebox_content($chelper, $course);

        // Add the course name.
        $coursename = $chelper->get_course_formatted_name($course);
        $content .= html_writer::start_tag('div', array('class' => 'panel-heading'));

        $content .= html_writer::end_tag('div'); // End .panel-heading.

        $content .= html_writer::start_tag('div', array('class' => 'panel-body clearfix'));
        $content .= html_writer::link(new moodle_url('/course/view.php', array('id' => $course->id)),
                    $coursename, array('class' => $course->visible ? '' : 'dimmed', 'title' => $coursename));

        $content .= html_writer::end_tag('div'); // End .panel-body.

        $content .= html_writer::start_tag('div', array('class' => 'panel-foot clearfix'));

        $icondirection = 'left';
        if ('ltr' === get_string('thisdirection', 'langconfig')) {
            $icondirection = 'right';
        }
        $arrow = html_writer::tag('span', '', array('class' => 'fa fa-chevron-'.$icondirection));
        $btn = html_writer::tag('span', get_string('gotocourse', 'theme_abierta') . ' ' .
                $arrow, array('class' => 'get_stringlink'));

        if ($PAGE->pagelayout != 'incourse' && empty($PAGE->theme->settings->covhidebutton)) {
            $content .= html_writer::link(new moodle_url('/course/view.php',
                    array('id' => $course->id)), $btn, array('class' => " coursebtn submit btn btn-info btn-sm"));
        }

        if ($PAGE->pagetype == 'enrol-index') {
            if ($course->has_summary()) {
                $content .= html_writer::start_tag('p', array('class' => 'card-text'));
                $content .= $chelper->get_course_formatted_summary($course,
                    array('overflowdiv' => true, 'noclean' => true, 'para' => false));
                $content .= html_writer::end_tag('p'); // End summary.
            }
        }

        $content .= html_writer::end_tag('div'); // End .panel-foot.

        $content .= html_writer::end_tag('div'); // End .panel.

        return $content;
    }

    /**
     * Returns HTML to display course content (summary, course contacts and optionally category name)
     *
     * This method is called from coursecat_coursebox() and may be re-used in AJAX
     *
     * @param coursecat_helper $chelper various display options
     * @param stdClass|course_in_list $course
     * @return string
     */
    protected function coursecat_coursebox_content(coursecat_helper $chelper, $course) {
        global $CFG;
        if ($course instanceof stdClass) {
            require_once($CFG->libdir. '/coursecatlib.php');
            $course = new course_in_list($course);
        }
        $content = '';

        // Display course overview files.
        $contentimages = '';
        foreach ($course->get_course_overviewfiles() as $file) {
            $isimage = $file->is_valid_image();
            $url = file_encode_url("$CFG->wwwroot/pluginfile.php",
                    '/'. $file->get_contextid(). '/'. $file->get_component(). '/'.
                    $file->get_filearea(). $file->get_filepath(). $file->get_filename(), !$isimage);
            if ($isimage) {
                $contentimages .= html_writer::tag('div', '',
                        array('class' => 'courseimage', 'style' => 'background-image: url(' . $url . ')'));
                break;
            }
        }

        if (empty($contentimages)) {
            $url = new moodle_url($CFG->wwwroot . '/theme/abierta/pix/course.png');
            $contentimages .= html_writer::tag('div', '',
                    array('class' => 'courseimage', 'style' => 'background-image: url(' . $url . ')'));
        }

        $content .= $contentimages;

        // Display course category if necessary (for example in search results).
        if ($chelper->get_show_courses() == self::COURSECAT_SHOW_COURSES_EXPANDED_WITH_CAT) {

            if ($cat = core_course_category::get($course->category, IGNORE_MISSING)) {
                $content .= html_writer::start_tag('div', array('class' => 'coursecat'));
                $content .= get_string('category').': '.
                        html_writer::link(new moodle_url('/course/index.php', array('categoryid' => $cat->id)),
                                $cat->get_formatted_name(), array('class' => $cat->visible ? '' : 'dimmed'));
                $content .= html_writer::end_tag('div'); // .coursecat
            }
        }

        return $content;
    }

}
