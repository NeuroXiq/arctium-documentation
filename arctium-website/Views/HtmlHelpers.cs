using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace arctium_website.Views
{
    public static class HtmlHelpers
    {
        public static IHtmlContent BackButton(this IHtmlHelper helper, string route)
        {
            var button = new TagBuilder("a");

            button.AddCssClass("button button button--circle button--back spa-route");
            button.Attributes.Add("href", route);
            button.InnerHtml.AppendHtml(helper.SvgIcon("back-arrow"));

            return button;
        }

        public static IHtmlContent SvgIcon(this IHtmlHelper helper, string iconName)
        {
            var knowIcons = new string[] { "search", "back-arrow" };
            var iconPath = Path.Combine(Startup.WebRootPath, "svg-icons", $"{iconName}.svg");

            if (!knowIcons.Any(icon => icon == iconName))
            {
                throw new ArgumentException("Unknow svg icon name");
            }

            var iconHtml = File.ReadAllText(iconPath);
            var svgIcon = new TagBuilder("div");
            svgIcon.AddCssClass("icon");
            svgIcon.AddCssClass("icon-svg");

            svgIcon.InnerHtml.AppendHtml(iconHtml);


            return svgIcon;
        }

        public static IHtmlContent CodeBlockStart(this IHtmlHelper helper)
        {
            return helper.Raw("<div class=\"code-container\">" +
                "<div class=\"code\">" +
                "<pre>");
        }

        public static IHtmlContent CodeBlockEnd(this IHtmlHelper helper)
        {
            return helper.Raw("</pre></div></div>");
        }

        public static IHtmlContent Header(this IHtmlHelper helper, string content, int type, string id = null)
        {
            var tagName = $"h{type}";

            if (id == null)
            {
                id = content.ToLower().Replace(' ', '-')
                    .Replace('.','-')
                    .ToLower();
            }

            var header = new TagBuilder(tagName);

            header.AddCssClass(tagName);
            header.AddCssClass("header");
            header.InnerHtml.Append(content);

            return header;
        }

        public static IHtmlContent DescriptionList(this IHtmlHelper helper, string[] items, string[] descriptions)
        {
            if (items.Length != descriptions.Length) throw new ArgumentException("items length must be equal to description");

            var dl = new TagBuilder("dl");
            dl.AddCssClass("dl");

            for (int i = 0; i < items.Length; i++)
            {
                var dt = new TagBuilder("dt");
                var dd = new TagBuilder("dd");
                var strong = new TagBuilder("strong");
                strong.AddCssClass("strong");

                dt.AddCssClass("dt");
                dd.AddCssClass("dd");

                strong.InnerHtml.AppendHtml(items[i]);
                dt.InnerHtml.AppendHtml(strong);
                dd.InnerHtml.Append(descriptions[i]);

                dl.InnerHtml.AppendHtml(dt);
                dl.InnerHtml.AppendHtml(dd);
            }

            return dl;
        }

        public static IHtmlContent UnorderedList(this IHtmlHelper helper, string[] items)
        {
            var ul = new TagBuilder("ul");
            ul.AddCssClass("ul");

            foreach (var item in items)
            {
                var li = new TagBuilder("li");
                
                li.AddCssClass("li");

                li.InnerHtml.Append(item);
                ul.InnerHtml.AppendHtml(li);
            }

            return ul;
        }

        public static IHtmlContent TableSimple(this IHtmlHelper helper, string[] columns, string[][] rows)
        {
            var table = new TagBuilder("table");
            var thead = new TagBuilder("thead");
            var tbody = new TagBuilder("tbody");
            var theadRow = new TagBuilder("tr");

            table.AddCssClass("table");

            foreach (var column in columns)
            {
                var th = new TagBuilder("th");
                th.InnerHtml.Append(column);

                th.AddCssClass("th");
                theadRow.InnerHtml.AppendHtml(th);
            }

            thead.InnerHtml.AppendHtml(theadRow);

            int rowLength = rows[0].Length;

            for (int i = 0; i < rows.Length; i++)
            {
                if (rowLength != rows[i].Length) throw new ArgumentException("columns.length != rows.length");

                var row = new TagBuilder("tr");
                for (int j = 0; j < rowLength; j++)
                {
                    var td = new TagBuilder("td");
                    td.AddCssClass("td");

                    td.InnerHtml.Append(rows[i][j]);
                    row.InnerHtml.AppendHtml(td);
                }

                row.AddCssClass("tr");
                tbody.InnerHtml.AppendHtml(row);
            }

            table.InnerHtml.AppendHtml(thead);
            table.InnerHtml.AppendHtml(tbody);

            return table;
        }

        public static IHtmlContent TableSimple(this IHtmlHelper helper, string[] columns, params string[] rows)
        {
            if (rows.Length % columns.Length != 0) throw new ArgumentException("columns % rows != 0");
            
            int rowLen = columns.Length;
            int rowsCount = rows.Length / columns.Length;
            string[][] rowAsArray = new string[rows.Length / columns.Length][];

            for (int i = 0; i < rowsCount; i++)
            {
                rowAsArray[i] = new string[rowLen];
            }

            for (int i = 0; i < rows.Length; i++)
            {
                int rowIdx = i / rowLen;
                int colIdx = i % rowLen;

                rowAsArray[(rowIdx)][colIdx] = rows[i];
            }

            return helper.TableSimple(columns, rowAsArray);
        }

        public static IHtmlContent ItalicCode(this IHtmlHelper helper, string text)
        {
            var tag = new TagBuilder("i");

            tag.InnerHtml.Append(text);
            tag.AddCssClass("italic-code");

            return tag;
        }
    }
}
