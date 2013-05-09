## Development Version ##

* JSON export now contains portal IDs
* Fixed the "remove all" button not actually removing all
* Added number of fields to portal information

## Version 1.0.3 ##

* Improved tooltips
* CSV export now has the same options as KML export
* Added JSON export
* Added automatic downloader (see [docs/autoDownloader.md](docs/autoDownloader.md))

## Version 1.0.2 ##

* Adjusted maximum area to match the error message
* Fixed KML export
* Zero-length locations in the filter input are now handled correctly
* Closing the intel map now gives an error instead of querying forever
* Resonators are now colour-coded according to their level
 * You can also mouse-over each resonator to view energy levels
* Replaced coloured bars with more readable information
* Made sorting options more visible
 * Added sort by name, which is now the default sort

## Version 1.0.1 ##

* Redesigned map dialog
 * Search box is now clearly visible
 * Map is now properly centered when first opened
 * A message is now shown as soon as the map is zoomed out too far
* Fixed update URL in manifest
* Resonators that are missing from a portal now appear as a dash instead of not appearing at all
* Portal names now have more significantly more space
* The Ingress map links will now utilize IITC direct linking when available

## Version 1.0 ##

* New style to differentiate itself from the original extension
* Moved the default map center from Hong Kong to Brisbane
* Removed impossible values from coloured status bars in portal information (shields now stop at 4 and level stops at 8)
* Brought KML and CSV options front and center
* Automatic export filenames are now easier to interpret