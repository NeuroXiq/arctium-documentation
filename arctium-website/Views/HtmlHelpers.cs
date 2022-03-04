using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
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
    }
}
