// src/components/ToolLayout.jsx
import React from "react";
import PropTypes from "prop-types";

import pdfIcon from "../assets/Pannelpage/PDF.png";
import iconMonitor from "../assets/Pannelpage/Desktop.png";
import iconGrid from "../assets/Pannelpage/Dropbox.png";
import iconTriangle from "../assets/Pannelpage/googleDrive.png";
import iconCloud from "../assets/Pannelpage/Onedrive.png";
import iconBack from "../assets/Pannelpage/Back.png";

/**
 * ToolLayout
 *
 * Reusable layout that reproduces the MergePdf top bar + centered icons + right sidebar style.
 *
 * Props:
 * - title: sidebar title (default: "Merge")
 * - subtitle: sidebar subtitle/description (default: "Selected files will be merged into a single PDF.")
 * - mergedUrl: (optional) blob/url for preview shown in sidebar (iframe)
 * - error: optional error message to display in sidebar
 * - isMerging: boolean to show merging state for main action button
 * - onMerge: function to call when primary action button is clicked (e.g. merge)
 * - onDownload: function to call when "Download" is clicked (receives no args)
 * - topLeftControls: optional React node to render on the top-left (back + add buttons). If omitted, default Back + Add files placeholder is shown.
 * - leftList: React node to render in the left column (file list)
 * - mainContent: React node to render in the center preview area
 *
 * Place children components into leftList and mainContent slots.
 */
const ToolLayout = ({
  title = "Merge",
  subtitle = "Selected files will be merged into a single PDF.",
  mergedUrl = null,
  error = null,
  isMerging = false,
  onMerge = () => {},
  onDownload = () => {},
  topLeftControls = null,
  leftList = null,
  mainContent = null,
}) => {
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 mb-4">
          {/* top bar left (col-span-9) */}
          <div className="col-span-9 relative">
            <div className="flex items-center justify-start bg-[#F7E6E9]/[0.30] border border-[#F3D9DD] rounded-md px-4 py-6">
              <div className="flex items-center gap-10">
                {topLeftControls ? (
                  topLeftControls
                ) : (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-md text-gray-700 hover:text-red-700"
                    >
                      <img src={iconBack} alt="back" className="w-5 h-5" />
                      Back
                    </button>

                    <label
                      htmlFor="add-files-top"
                      className="inline-flex items-center gap-2 px-3 py-2 border border-[#B2011E] rounded-md bg-white cursor-pointer text-[16px]"
                    >
                      Add more files
                      <input
                        id="add-files-top"
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>

              {/* centered icons */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-3">
                  <button className="p-2 bg-white border border-[#B2011E] rounded-md">
                    <img src={iconMonitor} alt="monitor" className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white border border-[#B2011E] rounded-md">
                    <img src={iconGrid} alt="grid" className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white border border-[#B2011E] rounded-md">
                    <img
                      src={iconTriangle}
                      alt="triangle"
                      className="w-5 h-5"
                    />
                  </button>
                  <button className="p-2 bg-white border border-[#B2011E] rounded-md">
                    <img src={iconCloud} alt="cloud" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* right sidebar */}
          <aside className="col-span-3 row-span-2 bg-[#fbf8f8] border border-rose-100 rounded-md p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-3">{title}</h3>
              <p className="text-sm text-gray-600 mb-4">{subtitle}</p>

              {mergedUrl ? (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Merged preview</div>
                  <iframe
                    title="merged-preview"
                    src={mergedUrl}
                    style={{ width: "100%", height: 200 }}
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-500 mb-4">
                  {title} result will appear here.
                </div>
              )}

              {error && (
                <div className="text-sm text-red-600 mb-4">{error}</div>
              )}
            </div>

            <div>
              {mergedUrl ? (
                <div className="space-y-2">
                  <button
                    onClick={onDownload}
                    className="w-full py-3 rounded bg-red-700 text-white"
                  >
                    Download {title}
                  </button>
                  <a
                    href={mergedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-sm text-gray-700 mt-2"
                  >
                    Open in new tab
                  </a>
                </div>
              ) : (
                <button
                  onClick={onMerge}
                  disabled={isMerging}
                  className={`w-full py-3 rounded ${
                    isMerging ? "bg-gray-400" : "bg-red-700 text-white"
                  }`}
                >
                  {isMerging ? `${title}...` : `${title} Files`}
                </button>
              )}
            </div>
          </aside>

          {/* left list slot */}
          <div className="col-span-3">
            <aside className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-8 max-h-auto overflow-auto">
                {leftList ? (
                  leftList
                ) : (
                  <div className="text-sm text-gray-400 text-center py-8">
                    No items
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* main content slot */}
          <main className="col-span-6 bg-white border border-[#E7B0B9] rounded-lg p-6 flex items-center justify-center">
            {mainContent ? (
              mainContent
            ) : (
              <div className="text-center text-gray-400">
                <img
                  src={pdfIcon}
                  alt="pdf-placeholder"
                  className="mx-auto mb-4 w-28 h-28"
                />
                <div>No file selected</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

ToolLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  mergedUrl: PropTypes.string,
  error: PropTypes.string,
  isMerging: PropTypes.bool,
  onMerge: PropTypes.func,
  onDownload: PropTypes.func,
  topLeftControls: PropTypes.node,
  leftList: PropTypes.node,
  mainContent: PropTypes.node,
};

export default ToolLayout;
