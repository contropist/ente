import 'package:flutter/material.dart';
import 'package:photos/theme/colors.dart';
import 'package:photos/theme/ente_theme.dart';

class IconButtonWidget extends StatefulWidget {
  final bool isPrimary;
  final bool isSecondary;
  final bool isRounded;
  final IconData icon;
  final bool disableGestureDetector;
  final VoidCallback? onTap;
  final Color? defaultColor;
  final Color? pressedColor;
  final Color? iconColor;
  const IconButtonWidget({
    required this.icon,
    this.isPrimary = false,
    this.isSecondary = false,
    this.isRounded = false,
    this.disableGestureDetector = false,
    this.onTap,
    this.defaultColor,
    this.pressedColor,
    this.iconColor,
    super.key,
  });

  @override
  State<IconButtonWidget> createState() => _IconButtonWidgetState();
}

class _IconButtonWidgetState extends State<IconButtonWidget> {
  Color? iconStateColor;
  @override
  void didChangeDependencies() {
    setState(() {
      iconStateColor = null;
    });
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.isPrimary && !widget.isRounded && !widget.isSecondary) {
      return const SizedBox.shrink();
    }
    final colorTheme = getEnteColorScheme(context);
    iconStateColor ??
        (iconStateColor = widget.defaultColor ??
            (widget.isRounded ? colorTheme.fillFaint : null));
    return widget.disableGestureDetector
        ? _iconButton(colorTheme)
        : GestureDetector(
            onTapDown: _onTapDown,
            onTapUp: _onTapUp,
            onTapCancel: _onTapCancel,
            onTap: widget.onTap,
            child: _iconButton(colorTheme),
          );
  }

  Widget _iconButton(EnteColorScheme colorTheme) {
    return Padding(
      padding: const EdgeInsets.all(4.0),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 20),
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: iconStateColor,
        ),
        child: Icon(
          widget.icon,
          color: widget.iconColor ??
              (widget.isSecondary
                  ? colorTheme.strokeMuted
                  : colorTheme.strokeBase),
          size: 24,
        ),
      ),
    );
  }

  _onTapDown(details) {
    final colorTheme = getEnteColorScheme(context);
    setState(() {
      iconStateColor = widget.pressedColor ??
          (widget.isRounded ? colorTheme.fillMuted : colorTheme.fillFaint);
    });
  }

  _onTapUp(details) {
    Future.delayed(const Duration(milliseconds: 100), () {
      setState(() {
        iconStateColor = null;
      });
    });
  }

  _onTapCancel() {
    setState(() {
      iconStateColor = null;
    });
  }
}
