import clsx from "clsx"
import {
  getLinkWithBasePath,
  IconCloudSolid,
  IconHeadline,
  Link,
} from "docs-ui"
import Image from "next/image"

export const HomepageCloudSection = () => {
  return (
    <div className="border-t border-acmekit-border-base">
      <div
        className={clsx(
          "flex justify-center gap-2 lg:gap-4",
          "xl:mx-auto xl:max-w-[1136px] w-full py-4 px-1 sm:px-4 xl:px-0"
        )}
      >
        <div className="flex flex-col gap-1 w-full lg:w-1/3 xl:max-w-[336px]">
          <div className="flex flex-col gap-0.5">
            <IconHeadline title="Cloud" icon={<IconCloudSolid />} />
            <h2 className="text-h1 text-acmekit-fg-base">
              Deploy scalable applications with Cloud
            </h2>
            <div
              className={clsx(
                "text-acmekit-fg-subtle text-small-plus",
                "flex flex-col gap-1 lg:gap-2"
              )}
            >
              <span>
                Focus on building new features without worrying about
                infrastructure with our PaaS Cloud offering.
              </span>
              <span>
                Deploy directly from your GitHub repository on a
                security-compliant infrastructure that is pre-configured for
                optimal operation and scaling of your AcmeKit application.
              </span>
              <span>
                Access our support team and receive guidance as you build your
                application and go live.
              </span>
            </div>
          </div>
          <Link
            href={"https://docs.acmekit.com/cloud"}
            className="flex gap-0.25 items-center text-compact-small-plus"
            withIcon
          >
            <span>Learn about Cloud</span>
          </Link>
        </div>
        <div className="hidden lg:block lg:w-2/3">
          <Image
            src={getLinkWithBasePath("/images/cloud.png")}
            alt="Cloud"
            className="w-full h-auto"
            width={700}
            height={400}
          />
        </div>
      </div>
    </div>
  )
}
