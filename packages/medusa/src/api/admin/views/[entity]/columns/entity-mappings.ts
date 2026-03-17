export const ENTITY_MAPPINGS = {
  orders: {
    serviceName: "order",
    graphqlType: "Order",
    defaultVisibleFields: [
      "display_id",
      "created_at",
      "payment_status",
      "fulfillment_status",
      "total",
      "customer_display",
      "country",
      "sales_channel.name",
    ],
    fieldFilters: {
      // Fields that end with these suffixes will be excluded
      excludeSuffixes: ["_link"],
      // Fields that start with these prefixes will be excluded
      excludePrefixes: ["raw_"],
      // Specific field names to exclude
      excludeFields: ["order_change"],
    },
    computedColumns: {
      customer_display: {
        name: "Customer",
        render_type: "customer_name",
        required_fields: [
          "customer.first_name",
          "customer.last_name",
          "customer.email",
        ],
        optional_fields: ["customer.phone"],
        default_visible: true,
      },
      shipping_address_display: {
        name: "Shipping Address",
        render_type: "address_summary",
        required_fields: [
          "shipping_address.city",
          "shipping_address.country_code",
        ],
        optional_fields: [
          "shipping_address.address_1",
          "shipping_address.province",
          "shipping_address.postal_code",
        ],
        default_visible: false,
      },
      billing_address_display: {
        name: "Billing Address",
        render_type: "address_summary",
        required_fields: [
          "billing_address.city",
          "billing_address.country_code",
        ],
        optional_fields: [
          "billing_address.address_1",
          "billing_address.province",
          "billing_address.postal_code",
        ],
        default_visible: false,
      },
      country: {
        name: "Country",
        render_type: "country_code",
        required_fields: ["shipping_address.country_code"],
        optional_fields: [],
        default_visible: true,
      },
    },
  },
  products: {
    serviceName: "product",
    graphqlType: "Product",
    defaultVisibleFields: [
      "product_display",
      "collection.title",
      "sales_channels_display",
      "variants_count",
      "status",
    ],
    fieldFilters: {
      excludeSuffixes: ["_link"],
      excludePrefixes: ["raw_"],
      excludeFields: [],
    },
    computedColumns: {
      product_display: {
        name: "Product",
        render_type: "product_info",
        required_fields: [
          "title",
          "thumbnail",
        ],
        optional_fields: ["handle"],
        default_visible: true,
      },
      variants_count: {
        name: "Variants",
        render_type: "count",
        required_fields: [
          "variants",
        ],
        optional_fields: [],
        default_visible: true,
      },
      sales_channels_display: {
        name: "Sales Channels",
        render_type: "sales_channels_list",
        required_fields: [
          "sales_channels",
        ],
        optional_fields: [],
        default_visible: true,
      },
    },
  },
  customers: {
    serviceName: "customer",
    graphqlType: "Customer",
    defaultVisibleFields: [
      "email",
      "first_name",
      "last_name",
      "created_at",
      "updated_at",
    ],
    fieldFilters: {
      excludeSuffixes: ["_link"],
      excludePrefixes: ["raw_"],
      excludeFields: [],
    },
    computedColumns: {},
  },
  users: {
    serviceName: "user",
    graphqlType: "User",
    defaultVisibleFields: [
      "email",
      "first_name",
      "last_name",
      "created_at",
      "updated_at",
    ],
    fieldFilters: {
      excludeSuffixes: ["_link"],
      excludePrefixes: ["raw_"],
      excludeFields: [],
    },
    computedColumns: {},
  },
  regions: {
    serviceName: "region",
    graphqlType: "Region",
    defaultVisibleFields: ["name", "currency_code", "created_at", "updated_at"],
    fieldFilters: {
      excludeSuffixes: ["_link"],
      excludePrefixes: ["raw_"],
      excludeFields: [],
    },
    computedColumns: {},
  },
  "sales-channels": {
    serviceName: "salesChannel",
    graphqlType: "SalesChannel",
    defaultVisibleFields: [
      "name",
      "description",
      "is_disabled",
      "created_at",
      "updated_at",
    ],
    fieldFilters: {
      excludeSuffixes: ["_link"],
      excludePrefixes: ["raw_"],
      excludeFields: [],
    },
    computedColumns: {},
  },
}
