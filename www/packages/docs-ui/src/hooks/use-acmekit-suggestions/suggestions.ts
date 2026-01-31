import { ColoredAcmeKitIcon } from "../../components/Icons/ColoredAcmeKit"
import { CardProps } from "../../components/Card"

const CLOUD_SUGGESTION: CardProps = {
  title: "Deploy to Cloud",
  text: "Deploy and manage production-ready AcmeKit applications with zero-configuration deployments, automatic scaling, and GitHub integration, and more.",
  href: "https://cloud.acmekit.com/signup",
  icon: ColoredAcmeKitIcon,
}

const CLOUD_MAIL_SUGGESTION: CardProps = {
  title: "Deploy to Cloud",
  text: "Deploy to Cloud with email sending support out-of-the-box.",
  href: "https://cloud.acmekit.com/signup",
  icon: ColoredAcmeKitIcon,
}

const CLOUD_S3_SUGGESTION: CardProps = {
  title: "Deploy to Cloud",
  text: "Deploy to Cloud with S3 storage support out-of-the-box.",
  href: "https://cloud.acmekit.com/signup",
  icon: ColoredAcmeKitIcon,
}

const CLOUD_CACHE_SUGGESTION: CardProps = {
  title: "Deploy to Cloud",
  text: "Deploy to Cloud with caching support out-of-the-box.",
  href: "https://cloud.acmekit.com/signup",
  icon: ColoredAcmeKitIcon,
}

const CLOUD_STOREFRONT_SUGGESTION: CardProps = {
  title: "Deploy to Cloud",
  text: "Deploy to Cloud with storefront deployment support out-of-the-box.",
  href: "https://cloud.acmekit.com/signup",
  icon: ColoredAcmeKitIcon,
}

type Suggestions = Map<string, CardProps>

export const acmekitSuggestions: Suggestions = new Map([
  ["railway", CLOUD_SUGGESTION],
  ["heroku", CLOUD_SUGGESTION],
  ["aws", CLOUD_SUGGESTION],
  ["coolify", CLOUD_SUGGESTION],
  ["resend", CLOUD_MAIL_SUGGESTION],
  ["sendgrid", CLOUD_MAIL_SUGGESTION],
  ["s3", CLOUD_S3_SUGGESTION],
  ["minio", CLOUD_S3_SUGGESTION],
  ["cache", CLOUD_CACHE_SUGGESTION],
  ["caching", CLOUD_CACHE_SUGGESTION],
  ["vercel", CLOUD_STOREFRONT_SUGGESTION],
  ["netlify", CLOUD_STOREFRONT_SUGGESTION],
])
