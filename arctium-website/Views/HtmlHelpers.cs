using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.IO;
using System.Linq;

namespace arctium_website.Views
{
    public static class HtmlHelpers
    {
        public static IHtmlContent BackButton(this IHtmlHelper helper)
        {
            var button = new TagBuilder("a");

            button.AddCssClass("button button button--circle button--back spa-route-back");
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
    }
}
