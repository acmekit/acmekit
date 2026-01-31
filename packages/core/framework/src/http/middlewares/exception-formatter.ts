import { AcmeKitError } from "@acmekit/utils"

export enum PostgresError {
  DUPLICATE_ERROR = "23505",
  FOREIGN_KEY_ERROR = "23503",
  SERIALIZATION_FAILURE = "40001",
  NULL_VIOLATION = "23502",
}

export const formatException = (err): AcmeKitError => {
  switch (err.code) {
    case PostgresError.DUPLICATE_ERROR:
      return new AcmeKitError(
        AcmeKitError.Types.DUPLICATE_ERROR,
        `${err.table.charAt(0).toUpperCase()}${err.table.slice(
          1
        )} with ${err.detail.slice(4).replace(/[()=]/g, (s) => {
          return s === "=" ? " " : ""
        })}`
      )
    case PostgresError.FOREIGN_KEY_ERROR: {
      const matches =
        /Key \(([\w-\d]+)\)=\(([\w-\d]+)\) is not present in table "(\w+)"/g.exec(
          err.detail
        )

      if (matches?.length !== 4) {
        return new AcmeKitError(
          AcmeKitError.Types.NOT_FOUND,
          JSON.stringify(matches)
        )
      }

      return new AcmeKitError(
        AcmeKitError.Types.NOT_FOUND,
        `${matches[3]?.charAt(0).toUpperCase()}${matches[3]?.slice(1)} with ${
          matches[1]
        } ${matches[2]} does not exist.`
      )
    }
    case PostgresError.SERIALIZATION_FAILURE: {
      return new AcmeKitError(
        AcmeKitError.Types.CONFLICT,
        err?.detail ?? err?.message
      )
    }
    case PostgresError.NULL_VIOLATION: {
      return new AcmeKitError(
        AcmeKitError.Types.INVALID_DATA,
        `Can't insert null value in field ${err?.column} on insert in table ${err?.table}`
      )
    }
    default:
      return err
  }
}
