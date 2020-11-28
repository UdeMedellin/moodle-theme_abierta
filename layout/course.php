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
 * A two column layout for the abierta theme.
 *
 * @package   theme_abierta
 * @copyright  2020 David Herney
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

user_preference_allow_ajax_update('drawer-open-nav', PARAM_ALPHA);
user_preference_allow_ajax_update('sidepre-open', PARAM_ALPHA);

require_once($CFG->libdir . '/behat/lib.php');

if (isloggedin()) {
    $navdraweropen = (get_user_preferences('drawer-open-nav', 'true') == 'true');
    $draweropenright = (get_user_preferences('sidepre-open', 'true') == 'true');
} else {
    $navdraweropen = false;
    $draweropenright = false;
}

$blockshtml = $OUTPUT->blocks('side-pre');
$hasblocks = strpos($blockshtml, 'data-block=') !== false;

$blockscontenthtml = $OUTPUT->blocks('side-cont');
$hascontentblocks = strpos($blockscontenthtml, 'data-block=') !== false;

$postblockshtml = $OUTPUT->blocks('side-post');

$extraclasses = [];
if ($navdraweropen) {
    $extraclasses[] = 'drawer-open-left';
}

if ($draweropenright && $hasblocks) {
    $extraclasses[] = 'drawer-open-right';
}

$coursepresentation = theme_abierta_get_setting('coursepresentation');
if ($coursepresentation == 2) {
    $extraclasses[] = 'coursepresentation-cover';
}

// Special format to the course name.
$coursename = $PAGE->course->fullname;
$m = explode(' ', $coursename);

$first = '';
$last = '';
foreach ($m as $k => $n) {
    if ($k < (count($m) / 2)) {
        $first .= $n . ' ';
    } else {
        $last .= $n . ' ';
    }
}

$coursename = $first . '<span>' . $last . '</span>';
// End

$globalvars = new stdClass();
$globalvars->courseid = $PAGE->course->id;

$bodyattributes = $OUTPUT->body_attributes($extraclasses);
$regionmainsettingsmenu = $OUTPUT->region_main_settings_menu();
$templatecontext = [
    'output' => $OUTPUT,
    'sidepreblocks' => $blockshtml,
    'sidepostblocks' => $postblockshtml,
    'hasblocks' => $hasblocks,
    'bodyattributes' => $bodyattributes,
    'hasdrawertoggle' => true,
    'navdraweropen' => $navdraweropen,
    'draweropenright' => $draweropenright,
    'regionmainsettingsmenu' => $regionmainsettingsmenu,
    'hasregionmainsettingsmenu' => !empty($regionmainsettingsmenu),
    'globalvars' => $globalvars,
    'contentblocks' => $blockscontenthtml,
    'hascontentblocks' => $hascontentblocks,
    'coursename' => $coursename
];

// Improve boost navigation.
theme_abierta_boostnavigation_extend_navigation($PAGE->navigation);

$templatecontext['flatnavigation'] = $PAGE->flatnav;

$themesettings = new \theme_abierta\util\theme_settings();

$templatecontext = array_merge($templatecontext, $themesettings->generalvars(), $themesettings->footer_items());

if (!$coursepresentation || $coursepresentation == 1) {
    echo $OUTPUT->render_from_template('theme_abierta/course', $templatecontext);
} else if ($coursepresentation == 2) {
    echo $OUTPUT->render_from_template('theme_abierta/course_cover', $templatecontext);
}

