
#!/usr/bin/env bash
AUTHOR_EMAIL="50192480+tortooga2@users.noreply.github.com"

git ls-files | while read file; do
  git blame --show-email --line-porcelain "$file" \
    | awk -v email="$AUTHOR_EMAIL" -v path="$file" '
        # look for author-mail header
        $1=="author-mail" { sub(/^</, "", $2); sub(/>$/, "", $2); mail=$2 }
        # porcelain content lines start with a TAB
        /^\t/ {
          if (mail==email) {
            # print path: line-content (dropping the leading tab)
            print path ":" substr($0,2)
          }
        }
      '
done
