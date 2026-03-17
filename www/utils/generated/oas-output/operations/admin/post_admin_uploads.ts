/**
 * @oas [post] /admin/uploads
 * operationId: PostUploads
 * summary: Upload Files
 * description: Upload files to the configured File Module Provider.
 * x-authenticated: true
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         oneOf:
 *           - type: object
 *             description: The files to upload
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 description: The upload's files.
 *                 items:
 *                   oneOf:
 *                     - type: object
 *                       description: The file's files.
 *                       required:
 *                         - name
 *                         - content
 *                       properties:
 *                         name:
 *                           type: string
 *                           title: name
 *                           description: The file's name.
 *                         content:
 *                           type: string
 *                           title: content
 *                           description: The file's content.
 *                     - type: object
 *                       description: A File to upload.
 *                       externalDocs:
 *                         url: https://developer.mozilla.org/en-US/docs/Web/API/File
 *                         description: Learn more about the File API
 *                       title: files
 *           - type: array
 *             description: list of files to upload.
 *             items:
 *               type: object
 *               description: A File to upload.
 *               externalDocs:
 *                 url: https://developer.mozilla.org/en-US/docs/Web/API/File
 *                 description: Learn more about the File API
 *             title: FileList
 *         description: The files to upload.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.upload.create(
 *         {
 *           files: [
 *              // file uploaded as a binary string
 *             {
 *               name: "test.txt",
 *               content: "test", // Should be the binary string of the file
 *             },
 *             // file uploaded as a File object
 *             new File(["test"], "test.txt", { type: "text/plain" })
 *           ],
 *         }
 *       )
 *       .then(({ files }) => {
 *         console.log(files)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/uploads' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Uploads
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminFileListResponse"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * x-workflow: uploadFilesWorkflow
 * x-events: []
 * 
*/

