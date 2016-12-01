flatfish-flash
==============

Description: Script to flash FxOS images for Flatfish

Features:
- Flash images from witin the flatfish B2G source directory
- Flash images from any given directory
- Allow the user to provide the path to the B2G source, in order to use the 'adb' in there.
- Multiple checkings, including image file existence, adb status and running mode, device status, etc.
- Convert Flatfish into fastboot mode, flash, and reboot it.
- Allow the device to be running under the 'adb' or 'fastboot' mode.

Author: William Liang

==============

- Usage: flash-flatfish.sh [-h] [path_to_images [path_to_b2g_root]]
  - path_to_images: Optional. Default to ./out/target/product/flatfish/. 
  - path_to_b2g_root: Optional. Path to the root of the B2G source, for using 'adb' only. If 'adb' can be found in $PATH, this option can be ignored.
  - -h: help

- Example:
  1. Run in B2G root directory.
    - $ flash-flatfish.sh
  2. flash images in the current directory
    - $ flash-flatfish.sh .
  3. flash images in ~/flatfish-images
    - $ flash-flatfish.sh ~/flatfish-images
  4. flash images in ~/flatfish-images, and specify the source path of B2G for using 'adb'
    - $ flash-flatfish.sh ~/flatfish-images ~/dev_fxos/a31-b2g

# roundraw.github.io
